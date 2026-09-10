from flask import Blueprint, request, jsonify
import json
from database import get_db_connection

legal_bp = Blueprint('legal', __name__)

@legal_bp.route('', methods=['GET'])
def get_legal_resources():
    category = request.args.get('category')
    search = request.args.get('search', '').strip().lower()

    conn = get_db_connection()
    cursor = conn.cursor()

    query = "SELECT * FROM legal_resources WHERE 1=1"
    params = []

    if category and category.lower() != 'all':
        query += " AND category LIKE ?"
        params.append(f"%{category}%")

    cursor.execute(query, params)
    rows = cursor.fetchall()
    conn.close()

    legal_list = []
    for r in rows:
        practical_steps = json.loads(r['practical_steps']) if r['practical_steps'] else []
        legal_aid = json.loads(r['legal_aid_contacts']) if r['legal_aid_contacts'] else []

        if search:
            match = (
                search in r['title'].lower() or
                search in r['problem_summary'].lower() or
                search in r['rights_overview'].lower() or
                search in r['category'].lower()
            )
            if not match:
                continue

        legal_list.append({
            'id': r['id'],
            'title': r['title'],
            'category': r['category'],
            'problem_summary': r['problem_summary'],
            'rights_overview': r['rights_overview'],
            'practical_steps': practical_steps,
            'legal_aid_contacts': legal_aid,
            'official_acts': r['official_acts'],
            'disclaimer': r['disclaimer']
        })

    return jsonify({'legal_resources': legal_list, 'count': len(legal_list)}), 200

@legal_bp.route('/<resource_id>', methods=['GET'])
def get_legal_resource(resource_id):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM legal_resources WHERE id = ?", (resource_id,))
    r = cursor.fetchone()
    conn.close()

    if not r:
        return jsonify({'error': 'Legal guide not found'}), 404

    guide = {
        'id': r['id'],
        'title': r['title'],
        'category': r['category'],
        'problem_summary': r['problem_summary'],
        'rights_overview': r['rights_overview'],
        'practical_steps': json.loads(r['practical_steps']) if r['practical_steps'] else [],
        'legal_aid_contacts': json.loads(r['legal_aid_contacts']) if r['legal_aid_contacts'] else [],
        'official_acts': r['official_acts'],
        'disclaimer': r['disclaimer']
    }
    return jsonify({'legal_resource': guide}), 200
