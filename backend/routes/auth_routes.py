from flask import Blueprint, request, jsonify
import uuid
import json
import random
from database import get_db_connection

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json() or {}
    email = data.get('email', '').strip().lower()
    password = data.get('password', '')
    preferred_name = data.get('preferred_name', '').strip()
    is_anonymous = 1 if data.get('is_anonymous') else 0
    role = data.get('role', 'user')
    location = data.get('location', '').strip() if data.get('location') else None
    skills = data.get('skills', [])
    seeking_goals = data.get('seeking_goals', [])

    if not email or not password:
        return jsonify({'error': 'Email and password are required'}), 400

    if is_anonymous or not preferred_name:
        anon_handle = f"SakshamMember_{random.randint(100, 999)}"
        preferred_name = anon_handle
    else:
        anon_handle = None

    user_id = f"user-{uuid.uuid4().hex[:8]}"

    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        # Check existing
        cursor.execute("SELECT id FROM users WHERE email = ?", (email,))
        if cursor.fetchone():
            return jsonify({'error': 'An account with this email already exists'}), 409

        cursor.execute(
            '''INSERT INTO users (id, email, password_hash, preferred_name, is_anonymous, anonymous_handle, role, location)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?)''',
            (user_id, email, f"hash_{password}", preferred_name, is_anonymous, anon_handle, role, location)
        )

        cursor.execute(
            '''INSERT INTO profiles (user_id, seeking_goals, skills, experience_level, education, preferred_job_type, notification_preferences)
               VALUES (?, ?, ?, ?, ?, ?, ?)''',
            (
                user_id,
                json.dumps(seeking_goals),
                json.dumps(skills),
                data.get('experience_level', 'Entry-level'),
                data.get('education', ''),
                data.get('preferred_job_type', 'Full-time'),
                json.dumps({'email_notifications': True, 'job_alerts': True})
            )
        )

        # Welcome notification
        notif_id = f"notif-{uuid.uuid4().hex[:8]}"
        cursor.execute(
            '''INSERT INTO notifications (id, user_id, title, message, type, link)
               VALUES (?, ?, ?, ?, ?, ?)''',
            (notif_id, user_id, 'Welcome to Saksham 👋', 'Your account is ready. Explore inclusive jobs, skill development, and verified government schemes.', 'info', '/dashboard')
        )

        conn.commit()

        user_info = {
            'id': user_id,
            'email': email,
            'preferred_name': preferred_name,
            'is_anonymous': bool(is_anonymous),
            'anonymous_handle': anon_handle,
            'role': role,
            'location': location,
            'skills': skills,
            'seeking_goals': seeking_goals
        }

        return jsonify({'message': 'User registered successfully', 'user': user_info}), 201
    except Exception as e:
        conn.rollback()
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json() or {}
    email = data.get('email', '').strip().lower()
    password = data.get('password', '')

    if not email:
        return jsonify({'error': 'Email is required'}), 400

    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        cursor.execute("SELECT * FROM users WHERE email = ?", (email,))
        user = cursor.fetchone()

        if not user:
            return jsonify({'error': 'Invalid email or password'}), 401

        # Fetch profile
        cursor.execute("SELECT * FROM profiles WHERE user_id = ?", (user['id'],))
        profile = cursor.fetchone()

        skills = json.loads(profile['skills']) if profile and profile['skills'] else []
        seeking_goals = json.loads(profile['seeking_goals']) if profile and profile['seeking_goals'] else []

        user_info = {
            'id': user['id'],
            'email': user['email'],
            'preferred_name': user['preferred_name'],
            'is_anonymous': bool(user['is_anonymous']),
            'anonymous_handle': user['anonymous_handle'],
            'role': user['role'],
            'location': user['location'],
            'bio': user['bio'],
            'skills': skills,
            'seeking_goals': seeking_goals
        }

        return jsonify({'message': 'Login successful', 'user': user_info}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()

@auth_bp.route('/me', methods=['GET'])
def get_me():
    user_id = request.headers.get('X-User-Id') or request.args.get('user_id') or 'user-seeker-1'

    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        cursor.execute("SELECT * FROM users WHERE id = ?", (user_id,))
        user = cursor.fetchone()
        if not user:
            return jsonify({'error': 'User not found'}), 404

        cursor.execute("SELECT * FROM profiles WHERE user_id = ?", (user['id'],))
        profile = cursor.fetchone()

        skills = json.loads(profile['skills']) if profile and profile['skills'] else []
        seeking_goals = json.loads(profile['seeking_goals']) if profile and profile['seeking_goals'] else []

        user_info = {
            'id': user['id'],
            'email': user['email'],
            'preferred_name': user['preferred_name'],
            'is_anonymous': bool(user['is_anonymous']),
            'anonymous_handle': user['anonymous_handle'],
            'role': user['role'],
            'location': user['location'],
            'bio': user['bio'],
            'skills': skills,
            'seeking_goals': seeking_goals
        }

        return jsonify({'user': user_info}), 200
    finally:
        conn.close()

@auth_bp.route('/profile', methods=['PUT'])
def update_profile():
    data = request.get_json() or {}
    user_id = data.get('id') or request.headers.get('X-User-Id') or 'user-seeker-1'

    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        if 'preferred_name' in data:
            cursor.execute("UPDATE users SET preferred_name = ? WHERE id = ?", (data['preferred_name'], user_id))
        if 'location' in data:
            cursor.execute("UPDATE users SET location = ? WHERE id = ?", (data['location'], user_id))
        if 'bio' in data:
            cursor.execute("UPDATE users SET bio = ? WHERE id = ?", (data['bio'], user_id))

        if 'skills' in data or 'seeking_goals' in data:
            skills_json = json.dumps(data.get('skills', [])) if 'skills' in data else None
            goals_json = json.dumps(data.get('seeking_goals', [])) if 'seeking_goals' in data else None

            if skills_json and goals_json:
                cursor.execute("UPDATE profiles SET skills = ?, seeking_goals = ? WHERE user_id = ?", (skills_json, goals_json, user_id))
            elif skills_json:
                cursor.execute("UPDATE profiles SET skills = ? WHERE user_id = ?", (skills_json, user_id))
            elif goals_json:
                cursor.execute("UPDATE profiles SET seeking_goals = ? WHERE user_id = ?", (goals_json, user_id))

        conn.commit()
        return jsonify({'message': 'Profile updated successfully'}), 200
    except Exception as e:
        conn.rollback()
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()

@auth_bp.route('/demo-switch', methods=['POST'])
def demo_switch():
    data = request.get_json() or {}
    target_role = data.get('role', 'user')

    role_user_map = {
        'user': 'user-seeker-1',
        'anonymous': 'user-seeker-anon',
        'employer': 'user-employer-1',
        'mentor': 'user-mentor-1',
        'admin': 'user-admin-1'
    }

    target_id = role_user_map.get(target_role, 'user-seeker-1')

    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        cursor.execute("SELECT * FROM users WHERE id = ?", (target_id,))
        user = cursor.fetchone()
        if not user:
            return jsonify({'error': 'Target demo user not found'}), 404

        cursor.execute("SELECT * FROM profiles WHERE user_id = ?", (user['id'],))
        profile = cursor.fetchone()

        skills = json.loads(profile['skills']) if profile and profile['skills'] else []
        seeking_goals = json.loads(profile['seeking_goals']) if profile and profile['seeking_goals'] else []

        user_info = {
            'id': user['id'],
            'email': user['email'],
            'preferred_name': user['preferred_name'],
            'is_anonymous': bool(user['is_anonymous']),
            'anonymous_handle': user['anonymous_handle'],
            'role': user['role'],
            'location': user['location'],
            'bio': user['bio'],
            'skills': skills,
            'seeking_goals': seeking_goals
        }

        return jsonify({'message': f'Switched to demo role: {target_role}', 'user': user_info}), 200
    finally:
        conn.close()
