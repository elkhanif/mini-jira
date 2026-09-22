# Mini Jira

Simple project management & issue tracking for IT teams. FastAPI + PostgreSQL backend, Next.js + Tailwind frontend.

## Live deployment

- **App:** https://mini-jira-app.vercel.app (Vercel)
- **API:** https://backend-production-ca477.up.railway.app (Railway, Postgres attached)
- **Repo:** https://github.com/elkhanif/mini-jira

The frontend never calls the API cross-origin — `next.config.mjs` rewrites `/api/*` to the backend (`BACKEND_URL` env var), so the browser only ever talks to the app's own domain and the session cookie is first-party.

Seeded accounts (password shown after email):
- `admin@minijira.app` / `admin123` (Admin)
- `khanif@minijira.app` / `member123` (Member)
- `dian@minijira.app` / `member123` (Member)

Seeded projects: `IT` (IT Operations), `WEB` (IT Web Developer), `SYS` (IT System Developer), `AST` (IT Asset Management) — each with sample issues across all four statuses.

## Running locally (Docker Compose)

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

docker compose up -d db
docker compose up --build backend frontend
```

Backend runs migrations automatically on startup (`alembic upgrade head`). Seed development data (safe to re-run — only adds what's missing):

```bash
docker compose exec backend python -m app.seed.seed_data
```

Frontend: http://localhost:3000
Backend docs: http://localhost:8000/docs

## Running backend tests

Tests need a running Postgres (`docker compose up -d db`) and a `minijira_test` database:

```bash
docker compose exec db psql -U minijira -c "CREATE DATABASE minijira_test;"
docker compose exec backend pytest
```

## Deploying

- **Backend (Railway):** one service built from `backend/Dockerfile`, plus a Postgres plugin. Env vars: `DATABASE_URL` (reference the Postgres plugin), `JWT_SECRET_KEY`, `JWT_ALGORITHM`, `ACCESS_TOKEN_EXPIRE_MINUTES`, `COOKIE_SECURE=true`, `COOKIE_SAMESITE=lax`, `CORS_ORIGINS` (the frontend's domain). Generate a public domain and run `python -m app.seed.seed_data` once via `railway ssh` to seed data.
- **Frontend (Vercel):** deploy the `frontend/` directory. Set `BACKEND_URL` (server-side, not `NEXT_PUBLIC_*`) to the Railway backend's public URL — it's only used by `next.config.mjs`'s rewrite, never sent to the browser. If Vercel's "Vercel Authentication" deployment protection is on, disable it (or add the domain as an allowed one) so the app is publicly reachable.

## Project structure

- `backend/` — FastAPI app (see `backend/app`)
- `frontend/` — Next.js App Router app (see `frontend/app`)
- `docker-compose.yml` — db + backend + frontend for local dev

Full design doc (architecture, ERD, API, roadmap) is available in the approved plan from this project's build session.
