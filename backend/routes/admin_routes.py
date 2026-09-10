from flask import Blueprint, request, jsonify
from database import get_db_connection

admin_bp = Blueprint('admin', __name__)

@admin_bp.route('/stats', methods=['GET'])
def get_stats():
    conn = get_db_connection()
    cursor = conn.cursor()

    stats = {}

    cursor.execute("SELECT COUNT(*) FROM users")
    stats['total_users'] = cursor.fetchone()[0]

    cursor.execute("SELECT COUNT(*) FROM jobs WHERE status = 'active'")
    stats['active_jobs'] = cursor.fetchone()[0]

    cursor.execute("SELECT COUNT(*) FROM applications")
    stats['total_applications'] = cursor.fetchone()[0]

    cursor.execute("SELECT COUNT(*) FROM courses")
    stats['total_courses'] = cursor.fetchone()[0]

    cursor.execute("SELECT COUNT(*) FROM government_schemes")
    stats['total_schemes'] = cursor.fetchone()[0]

    cursor.execute("SELECT COUNT(*) FROM legal_resources")
    stats['legal_guides'] = cursor.fetchone()[0]

    cursor.execute("SELECT COUNT(*) FROM support_locations")
    stats['map_locations'] = cursor.fetchone()[0]

    cursor.execute("SELECT COUNT(*) FROM mentors")
    stats['active_mentors'] = cursor.fetchone()[0]

    cursor.execute("SELECT COUNT(*) FROM community_reports WHERE status = 'pending'")
    stats['pending_reports'] = cursor.fetchone()[0]

    cursor.execute("SELECT COUNT(*) FROM community_posts")
    stats['community_posts'] = cursor.fetchone()[0]

    conn.close()
    return jsonify({'stats': stats}), 200

@admin_bp.route('/reports', methods=['GET'])
def get_reports():
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute('''
        SELECT r.id as report_id, r.post_id, r.reason, r.status, r.created_at as reported_at,
               p.title as post_title, p.content as post_content, p.author_name, p.is_anonymous
        FROM community_reports r
        JOIN community_posts p ON r.post_id = p.id
        ORDER BY r.created_at DESC
    ''')
    rows = cursor.fetchall()
    conn.close()

    reports = [dict(r) for r in rows]
    return jsonify({'reports': reports}), 200

@admin_bp.route('/reports/<report_id>/resolve', methods=['POST'])
def resolve_report(report_id):
    data = request.get_json() or {}
    action = data.get('action', 'dismiss') # 'remove_post' or 'dismiss'

    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        cursor.execute("SELECT post_id FROM community_reports WHERE id = ?", (report_id,))
        rep = cursor.fetchone()
        if not rep:
            return jsonify({'error': 'Report not found'}), 404

        post_id = rep['post_id']

        if action == 'remove_post':
            cursor.execute("UPDATE community_posts SET is_reported = 1 WHERE id = ?", (post_id,))
            cursor.execute("UPDATE community_reports SET status = 'resolved' WHERE id = ?", (report_id,))
            msg = 'Post removed and report marked as resolved.'
        else:
            cursor.execute("UPDATE community_reports SET status = 'dismissed' WHERE id = ?", (report_id,))
            msg = 'Report dismissed after verification.'

        conn.commit()
        return jsonify({'message': msg}), 200
    except Exception as e:
        conn.rollback()
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()
