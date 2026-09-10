from flask import Blueprint, request, jsonify
import uuid
from database import get_db_connection

resources_bp = Blueprint('resources', __name__)

@resources_bp.route('', methods=['GET'])
def get_courses():
    category = request.args.get('category')
    mode = request.args.get('mode')
    is_free = request.args.get('free')
    level = request.args.get('level')
    search = request.args.get('search', '').strip().lower()

    conn = get_db_connection()
    cursor = conn.cursor()

    query = "SELECT * FROM courses WHERE 1=1"
    params = []

    if category and category.lower() != 'all':
        query += " AND (skill_category LIKE ? OR title LIKE ?)"
        params.extend([f"%{category}%", f"%{category}%"])

    if mode and mode.lower() != 'all':
        query += " AND mode = ?"
        params.append(mode)

    if is_free in ['1', 'true', 'True']:
        query += " AND is_free = 1"

    if level and level.lower() != 'all':
        query += " AND level LIKE ?"
        params.append(f"%{level}%")

    query += " ORDER BY created_at DESC"

    cursor.execute(query, params)
    rows = cursor.fetchall()
    conn.close()

    courses_list = []
    for r in rows:
        if search:
            match = (
                search in r['title'].lower() or
                search in r['description'].lower() or
                search in r['provider'].lower() or
                search in r['skill_category'].lower()
            )
            if not match:
                continue

        courses_list.append({
            'id': r['id'],
            'title': r['title'],
            'description': r['description'],
            'skill_category': r['skill_category'],
            'provider': r['provider'],
            'duration': r['duration'],
            'cost': r['cost'],
            'is_free': bool(r['is_free']),
            'mode': r['mode'],
            'level': r['level'],
            'link': r['link'],
            'eligibility': r['eligibility'],
            'is_verified': bool(r['is_verified'])
        })

    return jsonify({'courses': courses_list, 'count': len(courses_list)}), 200

@resources_bp.route('/<course_id>', methods=['GET'])
def get_course(course_id):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM courses WHERE id = ?", (course_id,))
    r = cursor.fetchone()
    conn.close()

    if not r:
        return jsonify({'error': 'Course not found'}), 404

    course = {
        'id': r['id'],
        'title': r['title'],
        'description': r['description'],
        'skill_category': r['skill_category'],
        'provider': r['provider'],
        'duration': r['duration'],
        'cost': r['cost'],
        'is_free': bool(r['is_free']),
        'mode': r['mode'],
        'level': r['level'],
        'link': r['link'],
        'eligibility': r['eligibility'],
        'is_verified': bool(r['is_verified'])
    }
    return jsonify({'course': course}), 200

@resources_bp.route('', methods=['POST'])
def create_course():
    data = request.get_json() or {}
    course_id = f"course-{uuid.uuid4().hex[:8]}"

    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        cursor.execute(
            '''INSERT INTO courses (id, title, description, skill_category, provider, duration, cost, is_free, mode, level, link, eligibility, is_verified)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)''',
            (
                course_id,
                data.get('title'),
                data.get('description'),
                data.get('skill_category', 'Vocational'),
                data.get('provider', 'Certified Institute'),
                data.get('duration', '4 Weeks'),
                data.get('cost', 'Free'),
                1 if data.get('is_free', True) else 0,
                data.get('mode', 'Online'),
                data.get('level', 'Beginner'),
                data.get('link', 'https://skillindia.gov.in'),
                data.get('eligibility', 'Open to all applicants'),
                1
            )
        )
        conn.commit()
        return jsonify({'message': 'Course added successfully', 'course_id': course_id}), 201
    except Exception as e:
        conn.rollback()
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()
