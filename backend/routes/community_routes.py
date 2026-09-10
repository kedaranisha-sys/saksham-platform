from flask import Blueprint, request, jsonify
import uuid
import random
from database import get_db_connection

community_bp = Blueprint('community', __name__)

@community_bp.route('/posts', methods=['GET'])
def get_posts():
    channel = request.args.get('channel')
    search = request.args.get('search', '').strip().lower()

    conn = get_db_connection()
    cursor = conn.cursor()

    query = "SELECT * FROM community_posts WHERE is_reported = 0"
    params = []

    if channel and channel.lower() != 'all':
        query += " AND channel = ?"
        params.append(channel)

    query += " ORDER BY created_at DESC"

    cursor.execute(query, params)
    rows = cursor.fetchall()
    conn.close()

    posts_list = []
    for r in rows:
        if search:
            match = (
                search in r['title'].lower() or
                search in r['content'].lower() or
                search in r['channel'].lower()
            )
            if not match:
                continue

        posts_list.append({
            'id': r['id'],
            'user_id': r['user_id'],
            'author_name': 'Anonymous Member' if r['is_anonymous'] else r['author_name'],
            'is_anonymous': bool(r['is_anonymous']),
            'channel': r['channel'],
            'title': r['title'],
            'content': r['content'],
            'likes_count': r['likes_count'],
            'comments_count': r['comments_count'],
            'created_at': r['created_at']
        })

    return jsonify({'posts': posts_list, 'count': len(posts_list)}), 200

@community_bp.route('/posts/<post_id>', methods=['GET'])
def get_post_detail(post_id):
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM community_posts WHERE id = ?", (post_id,))
    post = cursor.fetchone()

    if not post:
        conn.close()
        return jsonify({'error': 'Post not found'}), 404

    cursor.execute("SELECT * FROM community_comments WHERE post_id = ? ORDER BY created_at ASC", (post_id,))
    comments = cursor.fetchall()
    conn.close()

    return jsonify({
        'post': {
            'id': post['id'],
            'user_id': post['user_id'],
            'author_name': 'Anonymous Member' if post['is_anonymous'] else post['author_name'],
            'is_anonymous': bool(post['is_anonymous']),
            'channel': post['channel'],
            'title': post['title'],
            'content': post['content'],
            'likes_count': post['likes_count'],
            'comments_count': post['comments_count'],
            'created_at': post['created_at']
        },
        'comments': [
            {
                'id': c['id'],
                'post_id': c['post_id'],
                'user_id': c['user_id'],
                'author_name': 'Anonymous Member' if c['is_anonymous'] else c['author_name'],
                'is_anonymous': bool(c['is_anonymous']),
                'content': c['content'],
                'created_at': c['created_at']
            }
            for c in comments
        ]
    }), 200

@community_bp.route('/posts', methods=['POST'])
def create_post():
    data = request.get_json() or {}
    title = data.get('title', '').strip()
    content = data.get('content', '').strip()
    channel = data.get('channel', 'general')
    is_anonymous = 1 if data.get('is_anonymous') else 0
    user_id = data.get('user_id') or request.headers.get('X-User-Id') or 'user-seeker-1'
    author_name = data.get('author_name', 'Community Member')

    if not title or not content:
        return jsonify({'error': 'Title and content are required'}), 400

    if is_anonymous:
        author_name = f"SakshamMember_{random.randint(100, 999)}"

    post_id = f"post-{uuid.uuid4().hex[:8]}"

    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        cursor.execute(
            '''INSERT INTO community_posts (id, user_id, author_name, is_anonymous, channel, title, content, likes_count, comments_count, is_reported)
               VALUES (?, ?, ?, ?, ?, ?, ?, 0, 0, 0)''',
            (post_id, user_id, author_name, is_anonymous, channel, title, content)
        )
        conn.commit()
        return jsonify({'message': 'Post created successfully', 'post_id': post_id}), 201
    except Exception as e:
        conn.rollback()
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()

@community_bp.route('/posts/<post_id>/comments', methods=['POST'])
def add_comment(post_id):
    data = request.get_json() or {}
    content = data.get('content', '').strip()
    is_anonymous = 1 if data.get('is_anonymous') else 0
    user_id = data.get('user_id') or request.headers.get('X-User-Id') or 'user-seeker-1'
    author_name = data.get('author_name', 'Community Member')

    if not content:
        return jsonify({'error': 'Comment content cannot be empty'}), 400

    if is_anonymous:
        author_name = f"SakshamMember_{random.randint(100, 999)}"

    comment_id = f"comm-{uuid.uuid4().hex[:8]}"

    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        cursor.execute(
            '''INSERT INTO community_comments (id, post_id, user_id, author_name, is_anonymous, content)
               VALUES (?, ?, ?, ?, ?, ?)''',
            (comment_id, post_id, user_id, author_name, is_anonymous, content)
        )
        cursor.execute("UPDATE community_posts SET comments_count = comments_count + 1 WHERE id = ?", (post_id,))
        conn.commit()
        return jsonify({'message': 'Comment added successfully', 'comment_id': comment_id}), 201
    except Exception as e:
        conn.rollback()
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()

@community_bp.route('/posts/<post_id>/like', methods=['POST'])
def like_post(post_id):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("UPDATE community_posts SET likes_count = likes_count + 1 WHERE id = ?", (post_id,))
    cursor.execute("SELECT likes_count FROM community_posts WHERE id = ?", (post_id,))
    row = cursor.fetchone()
    conn.commit()
    conn.close()

    new_likes = row['likes_count'] if row else 0
    return jsonify({'message': 'Post liked', 'likes_count': new_likes}), 200

@community_bp.route('/posts/<post_id>/report', methods=['POST'])
def report_post(post_id):
    data = request.get_json() or {}
    reason = data.get('reason', 'Inappropriate or harmful content')
    user_id = data.get('user_id') or request.headers.get('X-User-Id') or 'user-seeker-1'

    report_id = f"rep-{uuid.uuid4().hex[:8]}"

    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        cursor.execute(
            '''INSERT INTO community_reports (id, post_id, reported_by_user_id, reason, status)
               VALUES (?, ?, ?, ?, 'pending')''',
            (report_id, post_id, user_id, reason)
        )
        conn.commit()
        return jsonify({'message': 'Thank you for helping keep Saksham safe. This post has been sent to administrators for priority review.', 'report_id': report_id}), 201
    except Exception as e:
        conn.rollback()
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()
