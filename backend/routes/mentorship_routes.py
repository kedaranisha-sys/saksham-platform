from flask import Blueprint, request, jsonify
import json
import uuid
from database import get_db_connection

mentorship_bp = Blueprint('mentorship', __name__)

@mentorship_bp.route('', methods=['GET'])
def get_mentors():
    industry = request.args.get('industry')
    skill = request.args.get('skill')
    search = request.args.get('search', '').strip().lower()

    conn = get_db_connection()
    cursor = conn.cursor()

    query = "SELECT * FROM mentors WHERE is_accepting_mentees = 1"
    params = []

    if industry and industry.lower() != 'all':
        query += " AND industry LIKE ?"
        params.append(f"%{industry}%")

    cursor.execute(query, params)
    rows = cursor.fetchall()
    conn.close()

    mentors_list = []
    for r in rows:
        skills = json.loads(r['skills']) if r['skills'] else []

        if search:
            match = (
                search in r['name'].lower() or
                search in r['title'].lower() or
                search in r['organization'].lower() or
                search in r['industry'].lower() or
                search in r['bio'].lower() or
                any(search in s.lower() for s in skills)
            )
            if not match:
                continue

        if skill and skill.lower() != 'all':
            if not any(skill.lower() in s.lower() for s in skills):
                continue

        mentors_list.append({
            'id': r['id'],
            'user_id': r['user_id'],
            'name': r['name'],
            'title': r['title'],
            'organization': r['organization'],
            'industry': r['industry'],
            'years_experience': r['years_experience'],
            'skills': skills,
            'bio': r['bio'],
            'availability': r['availability'],
            'is_accepting_mentees': bool(r['is_accepting_mentees']),
            'avatar_url': r['avatar_url']
        })

    return jsonify({'mentors': mentors_list, 'count': len(mentors_list)}), 200

@mentorship_bp.route('/<mentor_id>', methods=['GET'])
def get_mentor(mentor_id):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM mentors WHERE id = ?", (mentor_id,))
    r = cursor.fetchone()
    conn.close()

    if not r:
        return jsonify({'error': 'Mentor not found'}), 404

    mentor = {
        'id': r['id'],
        'user_id': r['user_id'],
        'name': r['name'],
        'title': r['title'],
        'organization': r['organization'],
        'industry': r['industry'],
        'years_experience': r['years_experience'],
        'skills': json.loads(r['skills']) if r['skills'] else [],
        'bio': r['bio'],
        'availability': r['availability'],
        'is_accepting_mentees': bool(r['is_accepting_mentees']),
        'avatar_url': r['avatar_url']
    }
    return jsonify({'mentor': mentor}), 200

@mentorship_bp.route('/request', methods=['POST'])
def request_mentorship():
    data = request.get_json() or {}
    mentor_id = data.get('mentor_id')
    mentee_id = data.get('mentee_id') or request.headers.get('X-User-Id') or 'user-seeker-1'
    mentee_name = data.get('mentee_name', 'Mentee')
    mentee_email = data.get('mentee_email', 'mentee@saksham.org')
    goals = data.get('goals', 'Career transition guidance')
    message = data.get('message', '')

    if not mentor_id:
        return jsonify({'error': 'Mentor ID is required'}), 400

    req_id = f"req-{uuid.uuid4().hex[:8]}"

    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        cursor.execute(
            '''INSERT INTO mentor_requests (id, mentor_id, mentee_id, mentee_name, mentee_email, goals, message, status)
               VALUES (?, ?, ?, ?, ?, ?, ?, 'Pending')''',
            (req_id, mentor_id, mentee_id, mentee_name, mentee_email, goals, message)
        )

        # Notify mentee
        notif_id = f"notif-{uuid.uuid4().hex[:8]}"
        cursor.execute(
            '''INSERT INTO notifications (id, user_id, title, message, type, link)
               VALUES (?, ?, ?, ?, ?, ?)''',
            (notif_id, mentee_id, 'Mentorship Request Sent 🤝', 'Your mentorship request was received. We will notify you once the mentor responds.', 'mentor', '/mentorship')
        )

        conn.commit()
        return jsonify({'message': 'Mentorship request sent successfully', 'request_id': req_id}), 201
    except Exception as e:
        conn.rollback()
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()

@mentorship_bp.route('/my-requests', methods=['GET'])
def get_my_requests():
    user_id = request.headers.get('X-User-Id') or request.args.get('user_id') or 'user-seeker-1'

    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute('''
        SELECT r.id, r.mentor_id, r.goals, r.message, r.status, r.created_at,
               m.name as mentor_name, m.title as mentor_title, m.organization as mentor_org, m.industry, m.avatar_url
        FROM mentor_requests r
        JOIN mentors m ON r.mentor_id = m.id
        WHERE r.mentee_id = ?
        ORDER BY r.created_at DESC
    ''', (user_id,))
    rows = cursor.fetchall()
    conn.close()

    requests_list = [dict(r) for r in rows]
    return jsonify({'requests': requests_list}), 200

@mentorship_bp.route('/profile', methods=['POST'])
def become_mentor():
    data = request.get_json() or {}
    user_id = data.get('user_id') or request.headers.get('X-User-Id') or 'user-mentor-1'
    mentor_id = f"mentor-{uuid.uuid4().hex[:8]}"

    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        cursor.execute(
            '''INSERT INTO mentors (id, user_id, name, title, organization, industry, years_experience, skills, bio, availability, is_accepting_mentees, avatar_url)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?)''',
            (
                mentor_id,
                user_id,
                data.get('name', 'Community Mentor'),
                data.get('title', 'Specialist'),
                data.get('organization', 'Empowerment Network'),
                data.get('industry', 'General'),
                int(data.get('years_experience', 3)),
                json.dumps(data.get('skills', ['Career Guidance'])),
                data.get('bio', 'Dedicated mentor.'),
                data.get('availability', '2 hours/week'),
                data.get('avatar_url', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150')
            )
        )
        conn.commit()
        return jsonify({'message': 'Mentor profile created successfully', 'mentor_id': mentor_id}), 201
    except Exception as e:
        conn.rollback()
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()
