from flask import Blueprint, request, jsonify
import json
import uuid
from database import get_db_connection
from services.geo_service import calculate_haversine_distance, get_city_coords

map_bp = Blueprint('map', __name__)

@map_bp.route('', methods=['GET'])
def get_locations():
    category = request.args.get('category')
    city = request.args.get('city')
    search = request.args.get('search', '').strip().lower()
    user_lat = request.args.get('lat')
    user_lng = request.args.get('lng')

    # If city is supplied but no GPS, try to resolve city coordinates
    if city and not user_lat:
        resolved = get_city_coords(city)
        if resolved:
            user_lat, user_lng = resolved

    conn = get_db_connection()
    cursor = conn.cursor()

    query = "SELECT * FROM support_locations WHERE 1=1"
    params = []

    if category and category.lower() != 'all':
        query += " AND category = ?"
        params.append(category)

    if city and city.lower() != 'all':
        query += " AND (city LIKE ? OR state LIKE ?)"
        params.extend([f"%{city}%", f"%{city}%"])

    cursor.execute(query, params)
    rows = cursor.fetchall()
    conn.close()

    locations_list = []
    for r in rows:
        services = json.loads(r['services_offered']) if r['services_offered'] else []

        if search:
            match = (
                search in r['name'].lower() or
                search in r['city'].lower() or
                search in r['address'].lower() or
                search in r['category'].lower() or
                any(search in s.lower() for s in services)
            )
            if not match:
                continue

        # Distance calculation
        distance_km = None
        if user_lat and user_lng:
            try:
                distance_km = calculate_haversine_distance(user_lat, user_lng, r['lat'], r['lng'])
            except Exception:
                distance_km = None

        locations_list.append({
            'id': r['id'],
            'name': r['name'],
            'category': r['category'],
            'address': r['address'],
            'city': r['city'],
            'state': r['state'],
            'pincode': r['pincode'],
            'lat': r['lat'],
            'lng': r['lng'],
            'phone': r['phone'],
            'email': r['email'],
            'website': r['website'],
            'services_offered': services,
            'operating_hours': r['operating_hours'],
            'is_verified': bool(r['is_verified']),
            'distance_km': distance_km
        })

    if user_lat and user_lng:
        locations_list.sort(key=lambda x: (x['distance_km'] is None, x['distance_km']))

    return jsonify({'locations': locations_list, 'count': len(locations_list)}), 200

@map_bp.route('/<location_id>', methods=['GET'])
def get_location(location_id):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM support_locations WHERE id = ?", (location_id,))
    r = cursor.fetchone()
    conn.close()

    if not r:
        return jsonify({'error': 'Location not found'}), 404

    location = {
        'id': r['id'],
        'name': r['name'],
        'category': r['category'],
        'address': r['address'],
        'city': r['city'],
        'state': r['state'],
        'pincode': r['pincode'],
        'lat': r['lat'],
        'lng': r['lng'],
        'phone': r['phone'],
        'email': r['email'],
        'website': r['website'],
        'services_offered': json.loads(r['services_offered']) if r['services_offered'] else [],
        'operating_hours': r['operating_hours'],
        'is_verified': bool(r['is_verified'])
    }
    return jsonify({'location': location}), 200

@map_bp.route('', methods=['POST'])
def create_location():
    data = request.get_json() or {}
    loc_id = f"loc-{uuid.uuid4().hex[:8]}"

    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        cursor.execute(
            '''INSERT INTO support_locations (id, name, category, address, city, state, pincode, lat, lng, phone, email, website, services_offered, operating_hours, is_verified)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)''',
            (
                loc_id,
                data.get('name'),
                data.get('category', 'community'),
                data.get('address'),
                data.get('city'),
                data.get('state'),
                data.get('pincode'),
                float(data.get('lat', 28.6139)),
                float(data.get('lng', 77.2090)),
                data.get('phone'),
                data.get('email'),
                data.get('website'),
                json.dumps(data.get('services_offered', [])),
                data.get('operating_hours', 'Mon - Sat: 10:00 AM - 6:00 PM'),
                1
            )
        )
        conn.commit()
        return jsonify({'message': 'Location pin created successfully', 'location_id': loc_id}), 201
    except Exception as e:
        conn.rollback()
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()
