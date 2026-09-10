from flask import Blueprint, request, jsonify
import uuid
import json
from database import get_db_connection

jobs_bp = Blueprint('jobs', __name__)

@jobs_bp.route('', methods=['GET'])
def get_jobs():
    search = request.args.get('search', '').strip().lower()
    skill = request.args.get('skill', '').strip()
    location = request.args.get('location', '').strip()
    is_remote = request.args.get('remote')
    job_type = request.args.get('type')
    experience = request.args.get('experience')
    employer_id = request.args.get('employer_id')

    conn = get_db_connection()
    cursor = conn.cursor()

    query = "SELECT * FROM jobs WHERE status = 'active'"
    params = []

    if employer_id:
        query += " AND employer_id = ?"
        params.append(employer_id)

    if is_remote in ['1', 'true', 'True']:
        query += " AND is_remote = 1"

    if job_type:
        query += " AND job_type = ?"
        params.append(job_type)

    if experience:
        query += " AND experience_level LIKE ?"
        params.append(f"%{experience}%")

    if location and location.lower() != 'all':
        query += " AND location LIKE ?"
        params.append(f"%{location}%")

    query += " ORDER BY created_at DESC"

    cursor.execute(query, params)
    rows = cursor.fetchall()

    jobs_list = []
    for r in rows:
        skills = json.loads(r['skills_required']) if r['skills_required'] else []
        inclusive_policies = json.loads(r['inclusive_policies']) if r['inclusive_policies'] else []

        # Filter by search string in title, desc, skills
        if search:
            match = (
                search in r['title'].lower() or
                search in r['employer_name'].lower() or
                search in r['description'].lower() or
                any(search in s.lower() for s in skills)
            )
            if not match:
                continue

        # Filter by skill tag
        if skill and skill.lower() != 'all':
            if not any(skill.lower() in s.lower() for s in skills):
                continue

        jobs_list.append({
            'id': r['id'],
            'title': r['title'],
            'employer_id': r['employer_id'],
            'employer_name': r['employer_name'],
            'location': r['location'],
            'is_remote': bool(r['is_remote']),
            'job_type': r['job_type'],
            'experience_level': r['experience_level'],
            'salary_range': r['salary_range'],
            'skills_required': skills,
            'description': r['description'],
            'requirements': r['requirements'],
            'benefits': r['benefits'],
            'is_inclusive_workplace': bool(r['is_inclusive_workplace']),
            'inclusive_policies': inclusive_policies,
            'status': r['status'],
            'created_at': r['created_at']
        })

    conn.close()
    return jsonify({'jobs': jobs_list, 'count': len(jobs_list)}), 200

@jobs_bp.route('/<job_id>', methods=['GET'])
def get_job(job_id):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM jobs WHERE id = ?", (job_id,))
    r = cursor.fetchone()
    conn.close()

    if not r:
        return jsonify({'error': 'Job not found'}), 404

    job = {
        'id': r['id'],
        'title': r['title'],
        'employer_id': r['employer_id'],
        'employer_name': r['employer_name'],
        'location': r['location'],
        'is_remote': bool(r['is_remote']),
        'job_type': r['job_type'],
        'experience_level': r['experience_level'],
        'salary_range': r['salary_range'],
        'skills_required': json.loads(r['skills_required']) if r['skills_required'] else [],
        'description': r['description'],
        'requirements': r['requirements'],
        'benefits': r['benefits'],
        'is_inclusive_workplace': bool(r['is_inclusive_workplace']),
        'inclusive_policies': json.loads(r['inclusive_policies']) if r['inclusive_policies'] else [],
        'status': r['status'],
        'created_at': r['created_at']
    }
    return jsonify({'job': job}), 200

@jobs_bp.route('', methods=['POST'])
def create_job():
    data = request.get_json() or {}
    title = data.get('title')
    employer_name = data.get('employer_name')
    employer_id = data.get('employer_id') or request.headers.get('X-User-Id') or 'user-employer-1'
    location = data.get('location', 'Remote')
    is_remote = 1 if data.get('is_remote') else 0
    job_type = data.get('job_type', 'Full-time')
    experience_level = data.get('experience_level', 'Entry-level')
    salary_range = data.get('salary_range', 'Disclosed on interview')
    skills = data.get('skills_required', [])
    description = data.get('description', '')
    requirements = data.get('requirements', '')
    benefits = data.get('benefits', '')
    is_inclusive_workplace = 1 if data.get('is_inclusive_workplace', True) else 0
    inclusive_policies = data.get('inclusive_policies', ['Equal Opportunity Employer', 'Safe Workplace'])

    if not title or not employer_name or not description:
        return jsonify({'error': 'Title, Employer Name, and Description are required'}), 400

    job_id = f"job-{uuid.uuid4().hex[:8]}"

    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        cursor.execute(
            '''INSERT INTO jobs (id, title, employer_id, employer_name, location, is_remote, job_type, experience_level, salary_range, skills_required, description, requirements, benefits, is_inclusive_workplace, inclusive_policies, status)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)''',
            (
                job_id, title, employer_id, employer_name, location, is_remote, job_type,
                experience_level, salary_range, json.dumps(skills), description,
                requirements, benefits, is_inclusive_workplace, json.dumps(inclusive_policies), 'active'
            )
        )
        conn.commit()
        return jsonify({'message': 'Job posted successfully', 'job_id': job_id}), 201
    except Exception as e:
        conn.rollback()
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()

@jobs_bp.route('/<job_id>', methods=['PUT'])
def update_job(job_id):
    data = request.get_json() or {}
    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        cursor.execute(
            '''UPDATE jobs SET title = ?, location = ?, is_remote = ?, job_type = ?, experience_level = ?, salary_range = ?, description = ?, requirements = ?, benefits = ?
               WHERE id = ?''',
            (
                data.get('title'),
                data.get('location'),
                1 if data.get('is_remote') else 0,
                data.get('job_type'),
                data.get('experience_level'),
                data.get('salary_range'),
                data.get('description'),
                data.get('requirements'),
                data.get('benefits'),
                job_id
            )
        )
        conn.commit()
        return jsonify({'message': 'Job updated successfully'}), 200
    except Exception as e:
        conn.rollback()
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()

@jobs_bp.route('/<job_id>', methods=['DELETE'])
def delete_job(job_id):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("UPDATE jobs SET status = 'inactive' WHERE id = ?", (job_id,))
    conn.commit()
    conn.close()
    return jsonify({'message': 'Job removed successfully'}), 200

@jobs_bp.route('/<job_id>/apply', methods=['POST'])
def apply_job(job_id):
    data = request.get_json() or {}
    user_id = data.get('user_id') or request.headers.get('X-User-Id') or 'user-seeker-1'
    applicant_name = data.get('applicant_name', 'Applicant')
    email = data.get('email', 'applicant@example.com')
    notes = data.get('notes', '')
    resume_url = data.get('resume_url', '')

    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        # Check if already applied
        cursor.execute("SELECT id FROM applications WHERE job_id = ? AND user_id = ?", (job_id, user_id))
        if cursor.fetchone():
            return jsonify({'message': 'You have already applied for this position', 'already_applied': True}), 200

        app_id = f"app-{uuid.uuid4().hex[:8]}"
        cursor.execute(
            '''INSERT INTO applications (id, job_id, user_id, applicant_name, email, notes, resume_url, status)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?)''',
            (app_id, job_id, user_id, applicant_name, email, notes, resume_url, 'Applied')
        )

        # Create user notification
        cursor.execute("SELECT title, employer_name FROM jobs WHERE id = ?", (job_id,))
        job = cursor.fetchone()
        job_title = job['title'] if job else 'Position'

        notif_id = f"notif-{uuid.uuid4().hex[:8]}"
        cursor.execute(
            '''INSERT INTO notifications (id, user_id, title, message, type, link)
               VALUES (?, ?, ?, ?, ?, ?)''',
            (notif_id, user_id, 'Application Submitted 🎉', f'Your application for {job_title} was submitted successfully.', 'job', '/dashboard')
        )

        conn.commit()
        return jsonify({'message': 'Application submitted successfully', 'application_id': app_id}), 201
    except Exception as e:
        conn.rollback()
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()

@jobs_bp.route('/<job_id>/applicants', methods=['GET'])
def get_job_applicants(job_id):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM applications WHERE job_id = ? ORDER BY applied_at DESC", (job_id,))
    rows = cursor.fetchall()
    conn.close()

    applicants = [dict(r) for r in rows]
    return jsonify({'applicants': applicants, 'count': len(applicants)}), 200

@jobs_bp.route('/my-applications', methods=['GET'])
def get_my_applications():
    user_id = request.headers.get('X-User-Id') or request.args.get('user_id') or 'user-seeker-1'

    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute('''
        SELECT a.id as application_id, a.status as application_status, a.applied_at,
               j.id as job_id, j.title, j.employer_name, j.location, j.salary_range, j.job_type
        FROM applications a
        JOIN jobs j ON a.job_id = j.id
        WHERE a.user_id = ?
        ORDER BY a.applied_at DESC
    ''', (user_id,))
    rows = cursor.fetchall()
    conn.close()

    applications = [dict(r) for r in rows]
    return jsonify({'applications': applications}), 200

@jobs_bp.route('/recommendations', methods=['GET'])
def get_recommendations():
    user_id = request.headers.get('X-User-Id') or request.args.get('user_id') or 'user-seeker-1'

    conn = get_db_connection()
    cursor = conn.cursor()

    # Get user profile
    cursor.execute("SELECT * FROM profiles WHERE user_id = ?", (user_id,))
    profile = cursor.fetchone()
    user_skills = [s.lower() for s in json.loads(profile['skills'])] if profile and profile['skills'] else ['computer skills', 'communication']

    cursor.execute("SELECT * FROM jobs WHERE status = 'active'")
    all_jobs = cursor.fetchall()
    conn.close()

    recommendations = []
    for job in all_jobs:
        job_skills = [s.lower() for s in json.loads(job['skills_required'])] if job['skills_required'] else []
        matched_skills = [s for s in job_skills if any(us in s or s in us for us in user_skills)]

        match_score = int((len(matched_skills) / max(len(job_skills), 1)) * 100)
        # Give minimum 40% if remote or entry-level
        if job['is_remote'] or 'entry' in job['experience_level'].lower():
            match_score = max(match_score, 60)

        if match_score >= 50:
            recommendations.append({
                'id': job['id'],
                'title': job['title'],
                'employer_name': job['employer_name'],
                'location': job['location'],
                'salary_range': job['salary_range'],
                'is_remote': bool(job['is_remote']),
                'job_type': job['job_type'],
                'match_score': min(match_score, 98),
                'matched_skills': matched_skills,
                'explanation': f"Recommended because you have matching skills in: {', '.join([s.title() for s in matched_skills]) if matched_skills else 'Customer Communication & General Aptitude'}"
            })

    recommendations.sort(key=lambda x: x['match_score'], reverse=True)
    return jsonify({'recommendations': recommendations[:6]}), 200
