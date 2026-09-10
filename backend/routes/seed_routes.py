from flask import Blueprint, request, jsonify
import json
from database import get_db_connection
from seed_data import seed_database

system_bp = Blueprint('system', __name__)

@system_bp.route('/reset-demo-data', methods=['POST'])
def reset_data():
    try:
        seed_database()
        return jsonify({'message': 'System database successfully reset to authentic verified demo data.'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@system_bp.route('/notifications', methods=['GET'])
def get_notifications():
    user_id = request.headers.get('X-User-Id') or request.args.get('user_id') or 'user-seeker-1'

    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT 10", (user_id,))
    rows = cursor.fetchall()
    conn.close()

    notifs = [dict(r) for r in rows]
    return jsonify({'notifications': notifs, 'unread_count': len([n for n in notifs if not n['is_read']])}), 200

@system_bp.route('/notifications/<notif_id>/read', methods=['POST'])
def mark_read(notif_id):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("UPDATE notifications SET is_read = 1 WHERE id = ?", (notif_id,))
    conn.commit()
    conn.close()
    return jsonify({'message': 'Notification marked as read'}), 200

@system_bp.route('/global-search', methods=['GET'])
def global_search():
    q = request.args.get('q', '').strip().lower()
    if not q:
        return jsonify({'results': []}), 200

    conn = get_db_connection()
    cursor = conn.cursor()

    results = []

    # 1. Search Jobs
    cursor.execute("SELECT id, title, employer_name, location, salary_range FROM jobs WHERE status = 'active' AND (title LIKE ? OR employer_name LIKE ? OR skills_required LIKE ?) LIMIT 3", (f"%{q}%", f"%{q}%", f"%{q}%"))
    for r in cursor.fetchall():
        results.append({
            'type': 'Job',
            'title': r['title'],
            'subtitle': f"{r['employer_name']} • {r['location']}",
            'path': f"/jobs?id={r['id']}"
        })

    # 2. Search Courses
    cursor.execute("SELECT id, title, provider, duration, cost FROM courses WHERE title LIKE ? OR provider LIKE ? OR skill_category LIKE ? LIMIT 3", (f"%{q}%", f"%{q}%", f"%{q}%"))
    for r in cursor.fetchall():
        results.append({
            'type': 'Course',
            'title': r['title'],
            'subtitle': f"{r['provider']} • {r['cost']}",
            'path': f"/skills?id={r['id']}"
        })

    # 3. Search Schemes
    cursor.execute("SELECT id, name, provider, category FROM government_schemes WHERE name LIKE ? OR category LIKE ? OR description LIKE ? LIMIT 3", (f"%{q}%", f"%{q}%", f"%{q}%"))
    for r in cursor.fetchall():
        results.append({
            'type': 'Government Scheme',
            'title': r['name'],
            'subtitle': r['provider'],
            'path': f"/schemes?id={r['id']}"
        })

    # 4. Search Legal
    cursor.execute("SELECT id, title, category, official_acts FROM legal_resources WHERE title LIKE ? OR rights_overview LIKE ? OR category LIKE ? LIMIT 2", (f"%{q}%", f"%{q}%", f"%{q}%"))
    for r in cursor.fetchall():
        results.append({
            'type': 'Legal Rights',
            'title': r['title'],
            'subtitle': r['category'],
            'path': f"/legal?id={r['id']}"
        })

    # 5. Search Support Orgs
    cursor.execute("SELECT id, name, city, category, phone FROM support_locations WHERE name LIKE ? OR city LIKE ? OR services_offered LIKE ? LIMIT 2", (f"%{q}%", f"%{q}%", f"%{q}%"))
    for r in cursor.fetchall():
        results.append({
            'type': 'Support Org',
            'title': r['name'],
            'subtitle': f"{r['city']} • {r['category'].replace('_', ' ').capitalize()}",
            'path': f"/map?id={r['id']}"
        })

    conn.close()
    return jsonify({'results': results, 'total': len(results)}), 200
