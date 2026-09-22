from fastapi import APIRouter

from app.api.v1.endpoints import auth, comments, dashboard, issues, projects, users

api_router = APIRouter()
api_router.include_router(auth.router)
api_router.include_router(users.router)
api_router.include_router(projects.router)
api_router.include_router(issues.router)
api_router.include_router(comments.router)
api_router.include_router(dashboard.router)
