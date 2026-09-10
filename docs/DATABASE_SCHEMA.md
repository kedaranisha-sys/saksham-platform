# Saksham Database Schema

The database uses SQLite with normalized tables and JSON serialization for extensible arrays (skills, policies, documents). Designed to be 1-to-1 portable to Google Cloud Firestore or PostgreSQL.

---

## 1. Table Definitions

### `users`
Core user identity and authentication credentials.
- `id` (TEXT, PK): Unique user identifier (`user-seeker-1`, etc.)
- `email` (TEXT, UNIQUE): User email
- `password_hash` (TEXT): Hashed credentials
- `preferred_name` (TEXT): Display name or chosen name
- `is_anonymous` (INTEGER): 1 if user opted for privacy masking, 0 otherwise
- `anonymous_handle` (TEXT): Random handle (e.g. `SakshamMember_204`)
- `role` (TEXT): `user`, `employer`, `mentor`, `admin`
- `location` (TEXT): Optional city / state
- `bio` (TEXT): Optional personal biography
- `created_at` (TIMESTAMP): Account registration timestamp

### `profiles`
User goals and vocational skills for AI matching.
- `user_id` (TEXT, PK, FK -> `users.id`):
- `seeking_goals` (TEXT, JSON array): `["Employment", "Skill development", ...]`
- `skills` (TEXT, JSON array): `["Tailoring", "Computer skills", ...]`
- `experience_level` (TEXT): `Entry-level`, `1-3 years`, etc.
- `education` (TEXT): Educational background
- `preferred_job_type` (TEXT): `Full-time`, `Remote`, etc.
- `notification_preferences` (TEXT, JSON): Alert settings

### `jobs`
Marketplace openings from verified inclusive employers.
- `id` (TEXT, PK): Unique job identifier
- `title` (TEXT): Role title
- `employer_id` (TEXT): FK to employer user
- `employer_name` (TEXT): Company or organization name
- `location` (TEXT): City / State or Remote
- `is_remote` (INTEGER): 1 if remote work is supported
- `job_type` (TEXT): `Full-time`, `Part-time`, `Contract`, `Internship`
- `experience_level` (TEXT): Experience bracket
- `salary_range` (TEXT): Compensation package
- `skills_required` (TEXT, JSON array): Required skills
- `description` (TEXT): Role responsibilities
- `requirements` (TEXT): Candidate qualifications
- `benefits` (TEXT): Healthcare, gender transition leave, etc.
- `is_inclusive_workplace` (INTEGER): 1 if verified DEI committed
- `inclusive_policies` (TEXT, JSON array): Specific company DEI policies
- `status` (TEXT): `active` or `inactive`
- `created_at` (TIMESTAMP)

### `applications`
Job application submissions.
- `id` (TEXT, PK)
- `job_id` (TEXT, FK -> `jobs.id`)
- `user_id` (TEXT, FK -> `users.id`)
- `applicant_name` (TEXT)
- `email` (TEXT)
- `notes` (TEXT)
- `resume_url` (TEXT)
- `status` (TEXT): `Applied`, `Under Review`, `Interviewing`, `Accepted`, `Rejected`
- `applied_at` (TIMESTAMP)

### `courses`
Accredited vocational and digital skills programs.
- `id` (TEXT, PK)
- `title` (TEXT)
- `description` (TEXT)
- `skill_category` (TEXT): `Digital literacy`, `Tailoring`, `Programming`, etc.
- `provider` (TEXT): NSDC, NIELIT, EDII, etc.
- `duration` (TEXT): Duration string (e.g. `6 Weeks`)
- `cost` (TEXT): `Free` or fee
- `is_free` (INTEGER)
- `mode` (TEXT): `Online`, `Offline`, `Hybrid`
- `level` (TEXT): `Beginner`, `Intermediate`, `Advanced`
- `link` (TEXT): Verified application URL
- `eligibility` (TEXT): Qualifications needed
- `is_verified` (INTEGER)

### `government_schemes`
Authentic official welfare schemes.
- `id` (TEXT, PK)
- `name` (TEXT): Official scheme name (SMILE, Garima Greh, etc.)
- `provider` (TEXT): Ministry of Social Justice and Empowerment, NHA, etc.
- `category` (TEXT): `Education`, `Employment`, `Housing`, `Healthcare`, `Identity/documentation`, etc.
- `description` (TEXT)
- `eligibility` (TEXT)
- `benefits` (TEXT)
- `required_documents` (TEXT, JSON array): Document checklist
- `application_procedure` (TEXT): Step-by-step instructions
- `official_url` (TEXT): Government portal link
- `last_verified_date` (TEXT): ISO date of last official check
- `is_verified` (INTEGER)
- `is_demo` (INTEGER)

### `legal_resources`
Practical action guides under 2019 Act and NALSA 2014.
- `id` (TEXT, PK)
- `title` (TEXT)
- `category` (TEXT): `Employment discrimination`, `Housing`, `Identity/documentation`, etc.
- `problem_summary` (TEXT): "What happened?"
- `rights_overview` (TEXT): Statutory legal rights
- `practical_steps` (TEXT, JSON array): Step-by-step actions
- `legal_aid_contacts` (TEXT, JSON array): DLSA & NALSA contacts
- `official_acts` (TEXT): Legal citations
- `disclaimer` (TEXT)

### `support_locations`
Geospatial pins for interactive Leaflet map.
- `id` (TEXT, PK)
- `name` (TEXT): Organization or clinic name
- `category` (TEXT): `community`, `skill_center`, `legal_aid`, `healthcare`, `support_center`, `emergency`
- `address`, `city`, `state`, `pincode` (TEXT)
- `lat` (REAL), `lng` (REAL): Exact geographical coordinates
- `phone`, `email`, `website` (TEXT)
- `services_offered` (TEXT, JSON array)
- `operating_hours` (TEXT)
- `is_verified` (INTEGER)

### `mentors` & `mentor_requests`
Career and personal guidance matching.
- `mentors`: `id`, `user_id`, `name`, `title`, `organization`, `industry`, `years_experience`, `skills` (JSON), `bio`, `availability`, `is_accepting_mentees`, `avatar_url`
- `mentor_requests`: `id`, `mentor_id`, `mentee_id`, `mentee_name`, `mentee_email`, `goals`, `message`, `status` (`Pending`, `Accepted`)

### `community_posts`, `community_comments` & `community_reports`
Peer discussions with privacy and moderation safety.
- `community_posts`: `id`, `user_id`, `author_name`, `is_anonymous`, `channel`, `title`, `content`, `likes_count`, `comments_count`, `is_reported`, `created_at`
- `community_comments`: `id`, `post_id`, `user_id`, `author_name`, `is_anonymous`, `content`, `created_at`
- `community_reports`: `id`, `post_id`, `reported_by_user_id`, `reason`, `status` (`pending`, `resolved`, `dismissed`)

### `notifications`
In-app alert delivery.
- `id` (TEXT, PK), `user_id` (TEXT), `title` (TEXT), `message` (TEXT), `type` (TEXT), `link` (TEXT), `is_read` (INTEGER), `created_at` (TIMESTAMP)
