# Saksham REST API Documentation

Base URL: `http://localhost:5000/api`

All requests and responses use `application/json`.

---

## 1. Authentication & Profile (`/auth`)

### `POST /auth/register`
Register a new user account with privacy controls.
- **Request Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "securepassword",
    "preferred_name": "Aarav Sharma",
    "is_anonymous": false,
    "role": "user",
    "location": "New Delhi, India",
    "skills": ["Tailoring", "Computer skills"],
    "seeking_goals": ["Employment", "Skill development"]
  }
  ```
- **Response 201**: Returns created user object and initial session data.

### `POST /auth/login`
- **Request Body**: `{"email": "...", "password": "..."}`
- **Response 200**: Returns user profile, skills, and permissions.

### `GET /auth/me`
Fetches authenticated user information. Accepts `X-User-Id` header.

### `PUT /auth/profile`
Updates preferred name, bio, location, skills, or seeking goals.

### `POST /auth/demo-switch`
Instantly switch between demo personas:
- **Request Body**: `{"role": "user" | "anonymous" | "employer" | "mentor" | "admin"}`

---

## 2. Jobs & Employment (`/jobs`)

### `GET /jobs`
Query inclusive job listings.
- **Query Parameters**:
  - `search`: Keyword string
  - `skill`: Skill tag (e.g. `Tailoring`, `Customer Support`)
  - `location`: City string
  - `remote`: `1` or `true`
  - `type`: `Full-time`, `Part-time`, `Contract`, `Internship`
  - `experience`: `Entry-level`, `1-3 years`, etc.

### `POST /jobs`
Create a new job posting (Employer role).
- **Request Body**:
  ```json
  {
    "title": "Customer Support Executive",
    "employer_name": "Aegis Solutions",
    "location": "New Delhi",
    "is_remote": false,
    "job_type": "Full-time",
    "experience_level": "Entry-level",
    "salary_range": "₹22,000 - ₹28,000 / month",
    "skills_required": ["Communication", "Computer skills"],
    "description": "...",
    "requirements": "...",
    "benefits": "...",
    "is_inclusive_workplace": true,
    "inclusive_policies": ["Equal Opportunity", "Gender Affirmation Leave"]
  }
  ```

### `POST /jobs/<id>/apply`
Submit an application for a position.
- **Request Body**:
  ```json
  {
    "user_id": "user-seeker-1",
    "applicant_name": "Aarav Sharma",
    "email": "aarav@saksham.org",
    "notes": "Cover note...",
    "resume_url": "https://..."
  }
  ```

### `GET /jobs/<id>/applicants`
Returns applicants for a job listing (Employer access).

### `GET /jobs/my-applications`
Returns list of jobs applied to by the authenticated user.

### `GET /jobs/recommendations`
Calculates AI match score and explanation based on user's profile skills.

---

## 3. Skill Development (`/courses`)

### `GET /courses`
- **Query Parameters**: `category`, `mode` (`Online`/`Offline`), `free` (`1`), `level`, `search`.

---

## 4. Government Schemes (`/schemes`)

### `GET /schemes`
- **Query Parameters**: `category` (`Education`, `Employment`, `Housing`, `Healthcare`, `Identity/documentation`), `search`.
- **Response**: Array of official schemes with `required_documents`, `application_procedure`, `official_url`, and `last_verified_date`.

---

## 5. Legal Rights (`/legal`)

### `GET /legal`
- **Query Parameters**: `category`, `search`.
- **Response**: Structured guides with `problem_summary`, `rights_overview`, `practical_steps`, and `legal_aid_contacts`.

---

## 6. Geospatial Support Map (`/locations`)

### `GET /locations`
- **Query Parameters**:
  - `category`: `community`, `skill_center`, `legal_aid`, `healthcare`, `support_center`, `emergency`
  - `city`: `New Delhi`, `Mumbai`, `Bengaluru`, etc.
  - `lat`, `lng`: User coordinates for distance calculation in kilometers.

---

## 7. Community Peer Forum (`/community`)

### `GET /community/posts`
- **Query Parameters**: `channel` (`general`, `career`, `legal`, `wellness`, `success_stories`), `search`.

### `POST /community/posts`
- **Request Body**: `{"title": "...", "content": "...", "channel": "...", "is_anonymous": true}`

### `POST /community/posts/<id>/comments`
- **Request Body**: `{"content": "...", "is_anonymous": true}`

### `POST /community/posts/<id>/like`
Upvote a post.

### `POST /community/posts/<id>/report`
Flag inappropriate content for admin moderation.
- **Request Body**: `{"reason": "Hate speech / harassment"}`

---

## 8. Mentorship Network (`/mentors`)

### `GET /mentors`
- **Query Parameters**: `industry`, `skill`, `search`.

### `POST /mentors/request`
Submit request to mentor.
- **Request Body**: `{"mentor_id": "...", "goals": "...", "message": "..."}`

### `GET /mentors/my-requests`
Returns list of sent mentorship requests with current statuses (`Pending` / `Accepted`).

---

## 9. Saksham AI Navigator & Business Hub (`/ai`)

### `POST /ai/chat`
Conversational guidance endpoint with intent detection and knowledge grounding.
- **Request Body**:
  ```json
  {
    "message": "I know tailoring. How can I earn money?",
    "history": []
  }
  ```
- **Response 200**:
  ```json
  {
    "reply": "Starting your own independent enterprise...",
    "intent": "entrepreneurship",
    "suggested_actions": [
      {"title": "Generate AI Business Plan", "path": "/business"},
      {"title": "NBCFDC 4-6% Micro-Loans", "path": "/schemes?id=scheme-nbcfdc-loan"}
    ],
    "resources": [...],
    "disclaimer": "..."
  }
  ```

### `POST /ai/business-plan`
Generates customized startup model for micro-enterprises.
- **Request Body**: `{"skill_or_idea": "Tailoring and embroidery", "investment_budget": "Under 50,000"}`
- **Response 200**: Returns structured business plan with concept, equipment list, demo financial projections, government loan linkages, and 30-day launch roadmap.

---

## 10. Admin Governance (`/admin`)

### `GET /admin/stats`
Returns system counts: users, jobs, courses, schemes, locations, mentors, and pending reports.

### `GET /admin/reports`
Returns all flagged community reports.

### `POST /admin/reports/<id>/resolve`
Take action on flagged content:
- **Request Body**: `{"action": "remove_post" | "dismiss"}`

---

## 11. System Endpoints (`/system`)

### `POST /system/reset-demo-data`
Resets the SQLite database to the original verified seed data.

### `GET /system/global-search?q=<query>`
Searches across jobs, courses, schemes, legal resources, and map centers simultaneously.
