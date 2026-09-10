from flask import Blueprint, request, jsonify
import json
import uuid
from database import get_db_connection

schemes_bp = Blueprint('schemes', __name__)

@schemes_bp.route('', methods=['GET'])
def get_schemes():
    category = request.args.get('category')
    search = request.args.get('search', '').strip().lower()

    conn = get_db_connection()
    cursor = conn.cursor()

    query = "SELECT * FROM government_schemes WHERE 1=1"
    params = []

    if category and category.lower() != 'all':
        query += " AND category LIKE ?"
        params.append(f"%{category}%")

    query += " ORDER BY last_verified_date DESC"

    cursor.execute(query, params)
    rows = cursor.fetchall()
    conn.close()

    schemes_list = []
    for r in rows:
        req_docs = json.loads(r['required_documents']) if r['required_documents'] else []

        if search:
            match = (
                search in r['name'].lower() or
                search in r['provider'].lower() or
                search in r['description'].lower() or
                search in r['benefits'].lower() or
                search in r['category'].lower()
            )
            if not match:
                continue

        schemes_list.append({
            'id': r['id'],
            'name': r['name'],
            'provider': r['provider'],
            'category': r['category'],
            'description': r['description'],
            'eligibility': r['eligibility'],
            'benefits': r['benefits'],
            'required_documents': req_docs,
            'application_procedure': r['application_procedure'],
            'official_url': r['official_url'],
            'last_verified_date': r['last_verified_date'],
            'is_verified': bool(r['is_verified']),
            'is_demo': bool(r['is_demo'])
        })

    return jsonify({'schemes': schemes_list, 'count': len(schemes_list)}), 200

@schemes_bp.route('/<scheme_id>', methods=['GET'])
def get_scheme(scheme_id):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM government_schemes WHERE id = ?", (scheme_id,))
    r = cursor.fetchone()
    conn.close()

    if not r:
        return jsonify({'error': 'Scheme not found'}), 404

    scheme = {
        'id': r['id'],
        'name': r['name'],
        'provider': r['provider'],
        'category': r['category'],
        'description': r['description'],
        'eligibility': r['eligibility'],
        'benefits': r['benefits'],
        'required_documents': json.loads(r['required_documents']) if r['required_documents'] else [],
        'application_procedure': r['application_procedure'],
        'official_url': r['official_url'],
        'last_verified_date': r['last_verified_date'],
        'is_verified': bool(r['is_verified']),
        'is_demo': bool(r['is_demo'])
    }
    return jsonify({'scheme': scheme}), 200

@schemes_bp.route('', methods=['POST'])
def create_scheme():
    data = request.get_json() or {}
    scheme_id = f"scheme-{uuid.uuid4().hex[:8]}"

    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        cursor.execute(
            '''INSERT INTO government_schemes (id, name, provider, category, description, eligibility, benefits, required_documents, application_procedure, official_url, last_verified_date, is_verified, is_demo)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)''',
            (
                scheme_id,
                data.get('name'),
                data.get('provider'),
                data.get('category', 'Livelihood'),
                data.get('description'),
                data.get('eligibility'),
                data.get('benefits'),
                json.dumps(data.get('required_documents', [])),
                data.get('application_procedure'),
                data.get('official_url', 'https://transgender.dosje.gov.in'),
                data.get('last_verified_date', '2026-08-01'),
                1,
                0
            )
        )
        conn.commit()
        return jsonify({'message': 'Government scheme added successfully', 'scheme_id': scheme_id}), 201
    except Exception as e:
        conn.rollback()
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()
