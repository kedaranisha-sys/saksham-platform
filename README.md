# SAKSHAM – AI-Powered Transgender Empowerment & Support Platform
> **“Empowering Every Identity. Connecting Every Opportunity.”**

[![Platform Status](https://img.shields.io/badge/Status-Active%20Full--Stack-success)](https://github.com)
[![Frontend](https://img.shields.io/badge/Frontend-React%2018%20%7C%20Tailwind%20CSS-blue)](https://react.dev)
[![Backend](https://img.shields.io/badge/Backend-Python%20Flask%20REST%20API-teal)](https://flask.palletsprojects.com)
[![Geospatial](https://img.shields.io/badge/Maps-Leaflet.js%20%7C%20OpenStreetMap-green)](https://leafletjs.com)
[![AI Navigator](https://img.shields.io/badge/AI-Saksham%20AI%20%28Gemini%20%2B%20Knowledge%20Engine%29-indigo)](https://ai.google.dev)
[![Accessibility](https://img.shields.io/badge/A11y-WCAG%20AA%20Compliant-purple)](https://www.w3.org/WAI/standards-guidelines/wcag/)

---

## 1. Project Overview & Problem Statement

Transgender individuals in India and across the world often face multi-dimensional barriers to financial stability, social dignity, and physical safety:
1. **Employment Exclusion**: Discrimination in hiring, absence of gender-affirmative workplace policies, and bias.
2. **Information Fragmentation**: Lack of clear, centralized access to verified welfare programs (e.g. SMILE scheme, National TG Portal ID, Garima Greh shelter homes, Ayushman Bharat TG Plus package).
3. **Legal Ambiguity**: Difficulty asserting statutory rights under the *Transgender Persons (Protection of Rights) Act, 2019* and *NALSA (2014)* landmark judgment.
4. **Geographic Isolation**: Difficulty locating safe emergency shelters, sensitized healthcare clinics, and community support centers.
5. **Privacy Risks**: Forced disclosure of biological or deadname information during job searches or support inquiries.

**Saksham** is an enterprise-grade, privacy-first technology platform engineered to transform transgender welfare from passive awareness into active economic independence, practical legal defense, and verified geospatial community support.

---

## 2. Core Functional Modules

| Module | Features & Practical Utility |
| :--- | :--- |
| **Landing Page** | High-contrast modern startup aesthetic, "Why Saksham" 8 value pillars, 5-step journey, demo impact metrics, authentic helplines bar. |
| **Privacy-First Auth & Onboarding** | Preferred names, **"Prefer to remain anonymous"** toggle, role switching (Job Seeker, Employer, Mentor, Admin), goals & skills questionnaire, opt-in location. |
| **Personalized User Dashboard** | Welcome banner, quick-actions grid, **AI Recommended Opportunities** with % match scores and clear explanations ("Recommended because you have matching skills in..."), application progress tracking, and profile completeness meter. |
| **Saksham AI Virtual Guide** | Central conversational AI with natural-language intent recognition (Jobs, Skills, Schemes, Legal, Healthcare, Safety, Entrepreneurship), platform RAG knowledge matching, direct deep-link action buttons, and ethical guardrails (never impersonates doctors, lawyers, or emergency dispatchers). |
| **Inclusive Job Marketplace** | Verified job listings with **Inclusive Workplace Badges**, filterable by skill, location, remote options, and experience. Direct application modal and full Employer Portal (post jobs, edit, delete, review applicants). |
| **Skill Development Center** | 100% free accredited vocational training (commercial tailoring, beauty & wellness, hospitality, coding bootcamps, digital literacy) with verified application links and eligibility checklists. |
| **Government Support Finder** | Authentic Indian schemes (**SMILE Scheme**, **National Portal for Transgender Persons**, **Garima Greh Shelters**, **Ayushman Bharat TG Plus Health Package**, **PMKVY Special Projects**, **NBCFDC 4-6% Loans**). Features an **interactive required documents checklist** and last verified dates. |
| **Legal Rights & Action Center** | Structured legal guides formatted as: **Problem ("What Happened?")** → **Your Rights** → **Practical Action Steps** → **Where to Get Free Help** (DLSA / NALSA 15100). |
| **Geospatial Support Map** | Interactive Leaflet.js + OpenStreetMap with custom colored category pins (🟢 Community, 🔵 Skill, 🟣 Legal Aid, 🟠 Health, 🟡 Support, 🔴 Emergency/Shelters), opt-in GPS distance calculation (Haversine formula in km), and 1-click Google Maps driving directions. |
| **Moderated Community Forum** | Channel-based peer discussions (General, Career, Legal, Wellness, Success Stories), public vs. anonymous posting toggle, upvotes, comment threads, and zero-tolerance report moderation. |
| **Mentorship Matching** | Directory of verified queer and allied professionals across tech, tailoring, corporate DEI, law, and hospitality. Direct request pipeline with status tracking. |
| **Saksham Business Hub** | Entrepreneurship incubator with **AI Business Plan Generator**. Generates equipment requirements, target customers, MUDRA/NBCFDC micro-loans, demo financial projections, and a 30-day launch roadmap for skills like tailoring, salons, and catering. |
| **Safety & Crisis Center** | Official 24x7 Helplines (National Transgender Helpline 1800-200-1122, Tele-MANAS 14416, Police 112), **Trusted Contact Alert Dispatcher** (opt-in WhatsApp/SMS with optional GPS link), and **Safety Quick Exit (Esc×2)**. |
| **Admin Governance Dashboard** | Real-time platform metrics, content management, and community report moderation queue (review, dismiss, or remove flagged content). |

---

## 3. Technology Stack

- **Frontend**:
  - React 18 (Vite)
  - Tailwind CSS 3.4
  - Lucide React Icons
  - Leaflet 1.9 & React-Leaflet
  - Context Architecture (`AuthContext`, `AccessibilityContext`, `NotificationContext`)
- **Backend**:
  - Python 3.11 + Flask 3.1
  - Flask-CORS for cross-origin API integration
  - SQLite (Production zero-friction local datastore with Firebase Firestore compatibility)
  - `services/geo_service.py` (Haversine great-circle distance algorithm)
  - `services/ai_service.py` (Gemini API integration with local deterministic RAG knowledge fallback)
- **Safety & Accessibility**:
  - WCAG AA high-contrast mode
  - Font scaling (Normal, Large, Extra Large)
  - Keyboard accessibility (Ctrl+K global search, Esc×2 quick exit)

---

## 4. Installation & Local Setup

### Prerequisites
- Node.js (v18+)
- Python (v3.10+)
- npm or yarn

### Step 1: Clone or Navigate to Project
```bash
cd c:\Users\HP\Desktop\saksham-platform
```

### Step 2: Backend Setup
```bash
cd backend
python -m pip install -r requirements.txt
python seed_data.py
python app.py
```
*The backend REST API will start at `http://localhost:5000`.*

### Step 3: Frontend Setup
In a new terminal:
```bash
cd c:\Users\HP\Desktop\saksham-platform\frontend
npm install
npm run dev
```
*The Vite development server will launch at `http://localhost:5173`.*

---

## 5. Environment Variables Configuration

Create a `.env` file in `backend/` if you wish to configure optional Google Gemini API credentials:

```env
# backend/.env
SECRET_KEY=saksham-empowerment-secure-secret-2026
PORT=5000
FLASK_DEBUG=True
GEMINI_API_KEY=your_gemini_api_key_here # (Optional; platform has built-in smart knowledge engine fallback)
CORS_ORIGINS=*
```

---

## 6. Hackathon & Presentation Guide (6 Core Demos)

Use the top **Presentation Control Bar** to switch roles and trigger each of the 6 demonstration flows required in college project evaluations:

1. **Demo 1: AI Assistant → Job Recommendation**
   - Click *Ask Saksham AI* or select Demo 1.
   - Enter: *"I need a job in customer support and communication."*
   - Verify that Saksham AI categorizes intent, recommends matching jobs, and provides direct action buttons.
2. **Demo 2: Government Support Finder**
   - Select the *Government Schemes* tab.
   - Filter by *Identity/documentation* or *Housing*.
   - View the **National TG Portal** and **SMILE Scheme** with step-by-step application instructions and interactive document checklist.
3. **Demo 3: Interactive Support Map**
   - Open the *Support Map* tab.
   - Toggle categories (🟢 Community, 🔵 Skills, 🟣 Legal, 🔴 Garima Greh Shelters).
   - Click *"Find Near Me"* to calculate live distances in km and open directions in Google Maps.
4. **Demo 4: AI Skill & Job Matching**
   - Navigate to *Dashboard*.
   - View personalized job cards with match scores and the explanation: *"Recommended because you have matching skills in: [Tailoring, Customer Support]..."*
5. **Demo 5: Mentorship Matching**
   - Navigate to *Mentorship*.
   - Filter mentors by *Technology* or *Fashion & Tailoring*.
   - Click *"Request Mentorship"* and submit goals to see real-time request tracking.
6. **Demo 6: AI Business Hub (Entrepreneurship)**
   - Navigate to *Business Hub*.
   - Enter: *"I know tailoring and embroidery."*
   - Click *"Generate 30-Day Startup Plan"* to view equipment needed, NBCFDC 4-6% micro-loans, demo financial estimates, and the launch roadmap.

---

## 7. Data Authenticity & Verification Policy

- **Real Verified Policies**: Government schemes and legal guides are mapped to official Gazette notifications:
  - *Transgender Persons (Protection of Rights) Act, 2019* (Act No. 40 of 2019)
  - *Transgender Persons (Protection of Rights) Rules, 2020*
  - *National Portal for Transgender Persons (transgender.dosje.gov.in)*
  - *National Legal Services Authority vs. Union of India (2014) 5 SCC 438*
  - *Garima Greh Scheme Guidelines (MoSJE & NISD)*
- **Demo Data Disclaimer**: General sample metrics (e.g. 350+ opportunities) and sample user testimonials are explicitly labeled as demo illustrations to avoid fabricating real-world impact figures.
