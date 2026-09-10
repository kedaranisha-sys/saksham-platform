# Saksham – Project Architecture & Technical Design

## 1. Architectural Philosophy
Saksham is designed around three foundational engineering principles:
1. **Privacy by Default**: Zero forced disclosure of deadnames, biological history, or exact location. Users can choose full anonymity without degradation of service.
2. **Deterministic Grounding + Generative Flexibility**: High-stakes queries (legal rights, government welfare, emergency shelters) are grounded in verified database records before LLM generation.
3. **Resilient Offline-First Fallbacks**: All core features (matching algorithms, distance calculation, business plan generator) operate with high fidelity even when third-party APIs (such as Gemini LLM) are offline or unkeyed.

---

## 2. High-Level System Architecture

```
+-------------------------------------------------------------------------------+
|                             CLIENT APPLICATION                                |
|   (React 18 + Tailwind CSS + Lucide Icons + Leaflet.js + OpenStreetMap)       |
|                                                                               |
|  [Accessibility Bar] [Hackathon Demo Toolbar] [Top Navbar]                    |
|  [Dashboard] [Jobs Marketplace] [Skills] [Schemes] [Legal] [Map] [Community]  |
|  [Mentorship] [Business Hub] [Safety & Helplines] [Admin Dashboard]          |
|                                                                               |
|  Global Overlays:                                                             |
|   * Saksham AI Virtual Guide Drawer                                           |
|   * Global Search Modal (Ctrl+K)                                              |
|   * Emergency Crisis Modal (1800-200-1122 / 112)                              |
|   * Trusted Contact Dispatcher                                                |
+---------------------------------------+---------------------------------------+
                                        |  REST API (JSON over HTTP)
                                        v
+-------------------------------------------------------------------------------+
|                             BACKEND REST API                                  |
|                         (Python 3.11 + Flask 3.1)                             |
|                                                                               |
|  Route Controllers:                                                           |
|   * /api/auth       (Privacy Auth, Roles, Demo Persona Switcher)              |
|   * /api/jobs       (Listings, Employer Posting, AI Skill Matching)           |
|   * /api/courses    (Accredited Vocational Programs & Certifications)         |
|   * /api/schemes    (Verified Indian Welfare Policies & Checklists)           |
|   * /api/legal      (NALSA 2014 & 2019 Act Problem-Action Guides)             |
|   * /api/locations  (Geospatial Coordinates & Haversine Distance Engine)      |
|   * /api/community  (Moderated Forum, Anonymous Flag, Upvotes, Reports)      |
|   * /api/mentors    (Mentor Profiles, Request Pipeline & Tracking)            |
|   * /api/ai         (Saksham AI Conversational Assistant & Business Planner)  |
|   * /api/admin      (System Metrics & Moderation Queue)                       |
|   * /api/system     (Global Search, Notifications, Database Reset)            |
+--------------------+----------------------------------+-----------------------+
                     |                                  |
                     v                                  v
+-----------------------------+       +-----------------------------------------+
|     DATA PERSISTENCE        |       |        AI & GEOSPATIAL ENGINES          |
|  (SQLite / Firestore Sync)  |       |  * Google Gemini API (1.5 Flash)        |
|  15 Tables with Relational  |       |  * Saksham Deterministic Knowledge RAG  |
|  Constraints & JSON fields  |       |  * Haversine Great-Circle Distance      |
+-----------------------------+       +-----------------------------------------+
```

---

## 3. Data Flow & Subsystems

### 3.1 Saksham AI RAG & Intent Classification
1. **User Query**: e.g., *"I know tailoring. How can I earn money?"*
2. **Intent Classification**: Evaluates linguistic tokens for 9 categories (`jobs`, `skills`, `schemes`, `legal`, `map`, `entrepreneurship`, `safety`, `mentorship`, `community`).
3. **Database RAG Search**: Extracts top matching items from SQLite based on detected intent.
4. **LLM Generation**:
   - If `GEMINI_API_KEY` is present, prompt is dispatched with strict system instructions forbidding medical/legal impersonation.
   - If offline or unkeyed, the domain knowledge engine formats a structured response with verified listings, actionable next steps, and disclaimers.
5. **Interactive UI**: Client renders clickable action buttons directly linking to relevant modules.

### 3.2 Geospatial Distance Calculation Engine
- Uses the Haversine spherical trigonometric formula:
  $$\Delta\sigma = 2\arcsin\left(\sqrt{\sin^2\left(\frac{\Delta\phi}{2}\right) + \cos\phi_1\cos\phi_2\sin^2\left(\frac{\Delta\lambda}{2}\right)}\right)$$
  $$d = R \cdot \Delta\sigma$$
  where $R = 6371\text{ km}$.
- If GPS is not granted, uses municipal coordinate lookup for Delhi, Mumbai, Bengaluru, Hyderabad, Chennai, Kolkata, and Pune without user tracking.

### 3.3 Security & Role-Based Access Control (RBAC)
- **Roles**:
  - `user`: Job seeker / community member. Access to search, apply, community discussions, and mentor requests.
  - `employer`: Access to job creation, inclusive policy declaration, and applicant review.
  - `mentor`: Access to mentor profile creation and mentee request pipeline.
  - `admin`: Full platform governance, statistics, and community report moderation.
- **Safety Mechanisms**:
  - `Quick Exit`: ESC key double-press or button trigger replaces browser history with `https://www.google.com`.
  - Zero sensitive medical history stored.
