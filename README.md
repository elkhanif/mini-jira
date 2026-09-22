# Mini Jira

Simple project management & issue tracking for IT teams. FastAPI + PostgreSQL backend, Next.js + Tailwind frontend.

## Running locally (Docker Compose)

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

docker compose up -d db
docker compose up --build backend frontend
```

Backend runs migrations automatically on startup (`alembic upgrade head`). Seed development data:

```bash
docker compose exec backend python -m app.seed.seed_data
```

Seeded accounts (password shown after email):
- `admin@minijira.local` / `admin123` (Admin)
- `khanif@minijira.local` / `member123` (Member)
- `dewi@minijira.local` / `member123` (Member)

Frontend: http://localhost:3000
Backend docs: http://localhost:8000/docs

## Running backend tests

Tests need a running Postgres (`docker compose up -d db`) and a `minijira_test` database:

```bash
docker compose exec db psql -U minijira -c "CREATE DATABASE minijira_test;"
docker compose exec backend pytest
```

## Project structure

- `backend/` — FastAPI app (see `backend/app`)
- `frontend/` — Next.js App Router app (see `frontend/app`)
- `docker-compose.yml` — db + backend + frontend for local dev

Full design doc (architecture, ERD, API, roadmap) is available in the approved plan from this project's build session.
