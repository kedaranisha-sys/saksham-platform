import sqlite3
import json
import os
from config import Config

def get_db_connection():
    conn = sqlite3.connect(Config.DATABASE_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.executescript('''
    CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        preferred_name TEXT NOT NULL,
        is_anonymous INTEGER DEFAULT 0,
        anonymous_handle TEXT,
        role TEXT DEFAULT 'user', -- 'user', 'employer', 'mentor', 'admin'
        location TEXT,
        bio TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS profiles (
        user_id TEXT PRIMARY KEY,
        seeking_goals TEXT, -- JSON array
        skills TEXT, -- JSON array
        experience_level TEXT,
        education TEXT,
        preferred_job_type TEXT,
        notification_preferences TEXT,
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS jobs (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        employer_id TEXT,
        employer_name TEXT NOT NULL,
        location TEXT NOT NULL,
        is_remote INTEGER DEFAULT 0,
        job_type TEXT DEFAULT 'Full-time', -- 'Full-time', 'Part-time', 'Contract', 'Internship'
        experience_level TEXT DEFAULT 'Entry-level',
        salary_range TEXT,
        skills_required TEXT, -- JSON array
        description TEXT NOT NULL,
        requirements TEXT,
        benefits TEXT,
        is_inclusive_workplace INTEGER DEFAULT 1,
        inclusive_policies TEXT, -- JSON array
        status TEXT DEFAULT 'active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS applications (
        id TEXT PRIMARY KEY,
        job_id TEXT NOT NULL,
        user_id TEXT NOT NULL,
        applicant_name TEXT NOT NULL,
        email TEXT NOT NULL,
        notes TEXT,
        resume_url TEXT,
        status TEXT DEFAULT 'Applied', -- 'Applied', 'Under Review', 'Interviewing', 'Accepted', 'Rejected'
        applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (job_id) REFERENCES jobs (id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS courses (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        skill_category TEXT NOT NULL,
        provider TEXT NOT NULL,
        duration TEXT NOT NULL,
        cost TEXT DEFAULT 'Free',
        is_free INTEGER DEFAULT 1,
        mode TEXT DEFAULT 'Online', -- 'Online', 'Offline', 'Hybrid'
        level TEXT DEFAULT 'Beginner', -- 'Beginner', 'Intermediate', 'Advanced'
        link TEXT NOT NULL,
        eligibility TEXT,
        is_verified INTEGER DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS government_schemes (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        provider TEXT NOT NULL,
        category TEXT NOT NULL, -- 'Education', 'Employment', 'Financial assistance', 'Housing', 'Healthcare', 'Skill development', 'Entrepreneurship', 'Identity/documentation'
        description TEXT NOT NULL,
        eligibility TEXT NOT NULL,
        benefits TEXT NOT NULL,
        required_documents TEXT NOT NULL, -- JSON array
        application_procedure TEXT NOT NULL,
        official_url TEXT NOT NULL,
        last_verified_date TEXT NOT NULL,
        is_verified INTEGER DEFAULT 1,
        is_demo INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS legal_resources (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        category TEXT NOT NULL, -- 'Employment discrimination', 'Education', 'Housing', 'Healthcare', 'Identity/documentation', 'Violence/harassment', 'General rights'
        problem_summary TEXT NOT NULL,
        rights_overview TEXT NOT NULL,
        practical_steps TEXT NOT NULL, -- JSON array
        legal_aid_contacts TEXT NOT NULL, -- JSON array
        official_acts TEXT NOT NULL,
        disclaimer TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS support_locations (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        category TEXT NOT NULL, -- 'community', 'skill_center', 'legal_aid', 'healthcare', 'support_center', 'emergency'
        address TEXT NOT NULL,
        city TEXT NOT NULL,
        state TEXT NOT NULL,
        pincode TEXT,
        lat REAL NOT NULL,
        lng REAL NOT NULL,
        phone TEXT,
        email TEXT,
        website TEXT,
        services_offered TEXT, -- JSON array
        operating_hours TEXT,
        is_verified INTEGER DEFAULT 1
    );

    CREATE TABLE IF NOT EXISTS mentors (
        id TEXT PRIMARY KEY,
        user_id TEXT,
        name TEXT NOT NULL,
        title TEXT NOT NULL,
        organization TEXT NOT NULL,
        industry TEXT NOT NULL,
        years_experience INTEGER NOT NULL,
        skills TEXT NOT NULL, -- JSON array
        bio TEXT NOT NULL,
        availability TEXT DEFAULT '2 hours/week',
        is_accepting_mentees INTEGER DEFAULT 1,
        avatar_url TEXT
    );

    CREATE TABLE IF NOT EXISTS mentor_requests (
        id TEXT PRIMARY KEY,
        mentor_id TEXT NOT NULL,
        mentee_id TEXT NOT NULL,
        mentee_name TEXT NOT NULL,
        mentee_email TEXT NOT NULL,
        goals TEXT NOT NULL,
        message TEXT,
        status TEXT DEFAULT 'Pending', -- 'Pending', 'Accepted', 'Completed', 'Declined'
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (mentor_id) REFERENCES mentors (id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS community_posts (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        author_name TEXT NOT NULL,
        is_anonymous INTEGER DEFAULT 0,
        channel TEXT NOT NULL, -- 'general', 'career', 'legal', 'wellness', 'success_stories'
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        likes_count INTEGER DEFAULT 0,
        comments_count INTEGER DEFAULT 0,
        is_reported INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS community_comments (
        id TEXT PRIMARY KEY,
        post_id TEXT NOT NULL,
        user_id TEXT NOT NULL,
        author_name TEXT NOT NULL,
        is_anonymous INTEGER DEFAULT 0,
        content TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (post_id) REFERENCES community_posts (id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS community_reports (
        id TEXT PRIMARY KEY,
        post_id TEXT NOT NULL,
        reported_by_user_id TEXT NOT NULL,
        reason TEXT NOT NULL,
        status TEXT DEFAULT 'pending', -- 'pending', 'resolved', 'dismissed'
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS saved_resources (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        resource_type TEXT NOT NULL, -- 'job', 'course', 'scheme', 'legal'
        resource_id TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS notifications (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        title TEXT NOT NULL,
        message TEXT NOT NULL,
        type TEXT DEFAULT 'info', -- 'job', 'mentor', 'community', 'scheme', 'info'
        link TEXT,
        is_read INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    ''')

    conn.commit()
    conn.close()

if __name__ == '__main__':
    init_db()
    print("Database schema initialized successfully.")
