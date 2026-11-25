# Casely — Complete Deployment Guide

**Tagline:** Every Case Has a Network.  
**Preloaded Investigation:** Operation Silent Ledger (`CR-2026-0842`)

---

## Architecture Overview

Casely consists of two tiers:
1. **Frontend**: Next.js 16 (React 19, Tailwind CSS, TypeScript, Cytoscape.js, Recharts, Framer Motion)
2. **Backend**: FastAPI (Python 3.11+, SQLAlchemy async, SQLite/PostgreSQL, ReportLab PDF generation)

---

## Method 1: Cloud Deployment (Vercel + Render) [Recommended & Free]

This is the easiest and most reliable method for online demos and college project submissions.

### Step 1: Push Project to GitHub

```bash
git add .
git commit -m "Deploy Casely Platform"
git push origin main
```

---

### Step 2: Deploy the Backend on Render (or Railway)

1. Go to [render.com](https://render.com) and create an account.
2. Click **New +** -> **Web Service**.
3. Connect your GitHub repository.
4. Configure the Web Service settings:
   - **Name**: `casely-backend`
   - **Root Directory**: `Casely/backend`
   - **Environment**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
5. Add Environment Variables under **Environment**:
   - `ENVIRONMENT`: `production`
   - `BACKEND_CORS_ORIGINS`: `https://<your-vercel-app>.vercel.app,http://localhost:3000`
   - `GEMINI_API_KEY`: *(Optional, your Gemini API key)*
6. Click **Deploy Web Service**.
7. Note down your backend URL (e.g., `https://casely-backend.onrender.com`).

---

### Step 3: Deploy the Frontend on Vercel

1. Go to [vercel.com](https://vercel.com) and log in.
2. Click **Add New...** -> **Project**.
3. Select your GitHub repository.
4. In the configuration screen:
   - **Framework Preset**: Next.js
   - **Root Directory**: Click *Edit* and select `Casely/frontend`.
5. Add Environment Variable:
   - `NEXT_PUBLIC_API_URL`: `https://casely-backend.onrender.com` (your Render backend URL from Step 2)
6. Click **Deploy**.
7. In ~60 seconds, your site is live at `https://<your-app>.vercel.app`.

---

## Method 2: Docker / Docker Compose Deployment (VPS, Cloud VM, or Local)

Deploy both tiers and backing services with a single command on any Linux VPS (Ubuntu/Debian, AWS EC2, DigitalOcean Droplet, Linode) or local Docker Desktop.

### Prerequisites
- Docker & Docker Compose installed.

### 1-Command Startup

From the `Casely/` root directory:

```bash
docker compose up --build -d
```

### Accessing Services:
- **Frontend**: `http://localhost:3000` (or `http://<your-server-ip>:3000`)
- **Backend API**: `http://localhost:8000` (API Docs: `http://localhost:8000/docs`)
- **Neo4j Browser**: `http://localhost:7474`
- **Qdrant Vector DB**: `http://localhost:6333/dashboard`

To shut down:
```bash
docker compose down
```

---

## Method 3: Local Live Presentation (On Laptop / Lab Computer)

If you are presenting locally in an auditorium or university lab:

### Terminal 1: Backend
```bash
cd Casely/backend
# Windows
.\venv\Scripts\activate
# Linux/macOS
source venv/bin/activate

uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```

### Terminal 2: Frontend
```bash
cd Casely/frontend
npm run build
npm start
```

Open `http://localhost:3000` in your browser. All seed records, network graphs, timeline events, and PDF generation will work with zero external dependencies.
