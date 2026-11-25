# Casely — Every Case Has a Network.

Casely is an AI-powered investigation management platform. The pre-loaded investigation is **OPERATION SILENT LEDGER (CR-2026-0842)**.

---

## Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14, TypeScript, Tailwind CSS, shadcn/ui |
| Backend | FastAPI, Python 3.11+ |
| Relational DB | PostgreSQL 15 (via SQLAlchemy async) |
| Graph DB | Neo4j 5 |
| Vector DB | Qdrant v1.9 |
| AI | Google Gemini (via LangChain) |

---

## Prerequisites

- Node.js 18+
- Python 3.11+
- Docker & Docker Compose

---

## Quick Start

### 1. Clone & configure environment

```bash
cp .env.example .env
# Edit .env and fill in your secrets
```

### 2. Start infrastructure services

```bash
docker-compose up -d
```

This starts:
- **PostgreSQL** on port 5432
- **Neo4j** on port 7474 (browser) / 7687 (bolt)
- **Qdrant** on port 6333

### 3. Set up the backend

```bash
cd backend
python -m venv venv
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

pip install -r requirements.txt

# Run database migrations
alembic upgrade head

# Start the API server
uvicorn app.main:app --reload --port 8000
```

API docs available at: http://localhost:8000/docs

### 4. Set up the frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend available at: http://localhost:3000

---

## Project Structure

```
Casely/
├── frontend/           # Next.js 14 application
├── backend/            # FastAPI application
│   ├── app/
│   │   ├── api/        # Route handlers
│   │   ├── core/       # Config, DB, security
│   │   ├── models/     # SQLAlchemy ORM models
│   │   └── schemas/    # Pydantic response schemas
│   └── alembic/        # Database migrations
├── data/
│   └── operation_silent_ledger/   # Pre-loaded investigation data
│       ├── documents/
│       └── seed_data/
└── docs/               # Project documentation
```

---

## Pre-loaded Investigation

**OPERATION SILENT LEDGER — CR-2026-0842**

A complex financial fraud investigation. Seed data and documents are located in `data/operation_silent_ledger/`.

---

## Development

- Backend API: http://localhost:8000
- API Docs (Swagger): http://localhost:8000/docs
- API Docs (ReDoc): http://localhost:8000/redoc
- Frontend: http://localhost:3000
- Neo4j Browser: http://localhost:7474
- Qdrant Dashboard: http://localhost:6333/dashboard
