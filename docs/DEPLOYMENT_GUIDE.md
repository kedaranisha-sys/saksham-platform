# SAKSHAM Deployment Guide

This guide covers deploying the **Saksham** full-stack platform (React Vite frontend + Flask Python backend).

---

## Recommended Free Architecture

| Component | Recommended Host | Free Tier Benefits |
| :--- | :--- | :--- |
| **Frontend** | [Vercel](https://vercel.com) (or Netlify) | Global CDN, automatic HTTPS, continuous deployment from GitHub |
| **Backend** | [Render](https://render.com) (or Railway) | Free tier Python web services, automatic git deploy, built-in SSL |

---

## Pre-Deployment Checklist (Already Completed)

The following files and updates have been configured for production:
- `frontend/src/services/constants.js`: Enabled dynamic `VITE_API_BASE_URL` environment variable.
- `backend/requirements.txt`: Added production WSGI server `gunicorn`.
- `backend/Procfile`: Added process definition for Render/Heroku/Railway.
- `frontend/vercel.json`: Added SPA routing rewrite rule.
- `.gitignore`: Configured to exclude virtual environments, cache, and sensitive files.
- `Dockerfile` & `docker-compose.yml`: Configured for multi-container deployment.

---

## Step 1: Push Your Code to GitHub

Open a terminal in the project root:

```bash
cd c:\Users\HP\Desktop\saksham-platform

# Add all files and make initial commit
git add .
git commit -m "feat: production ready deployment configuration"

# Create a new repository on GitHub (e.g. named saksham-platform)
# Then link and push:
git branch -M main
git remote add origin https://github.com/<YOUR_GITHUB_USERNAME>/saksham-platform.git
git push -u origin main
```

---

## Step 2: Deploy Backend to Render

1. Sign up or log into [Render](https://render.com) using your GitHub account.
2. Click **New +** -> **Web Service**.
3. Connect your **saksham-platform** GitHub repository.
4. Configure the service settings:
   - **Name**: `saksham-api` (or your preferred name)
   - **Region**: Closest to you (e.g., *Singapore* or *Frankfurt*)
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Runtime**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `gunicorn app:app`
   - **Instance Type**: **Free**
5. Under **Environment Variables**, add:
   - `PORT`: `5000`
   - `FLASK_DEBUG`: `False`
   - `SECRET_KEY`: `<Generate a random secure string>`
   - `GEMINI_API_KEY`: *(Optional) Your Google Gemini API Key*
   - `CORS_ORIGINS`: `*`
6. Click **Create Web Service**.
7. Once deployed, Render will provide a live URL (e.g., `https://saksham-api.onrender.com`).
   - Test it by visiting `https://saksham-api.onrender.com/health` in your browser. It should return `{"status": "healthy"}`.

---

## Step 3: Deploy Frontend to Vercel

1. Sign up or log into [Vercel](https://vercel.com) with GitHub.
2. Click **Add New...** -> **Project**.
3. Import your **saksham-platform** repository.
4. Configure the project:
   - **Framework Preset**: `Vite`
   - **Root Directory**: Click *Edit* and choose `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Expand **Environment Variables** and add:
   - **Key**: `VITE_API_BASE_URL`
   - **Value**: `https://<YOUR_RENDER_URL>.onrender.com/api` *(replace with your actual backend URL from Step 2, appending `/api`)*
6. Click **Deploy**.
7. Vercel will build and assign you a live production URL (e.g., `https://saksham.vercel.app`).

---

## Option 2: Deploy with Docker (VPS / Cloud Run / Railway)

If you prefer to deploy using Docker containers:

```bash
# Build and run both frontend and backend locally or on any Linux server:
docker compose up --build -d
```

- Backend runs on `http://localhost:5000`
- Frontend runs on `http://localhost:80`
- SQLite database is persisted in the `saksham_db_data` volume.
