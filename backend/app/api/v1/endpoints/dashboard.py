from fastapi import APIRouter, Depends, Query
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.db.session import get_db
from app.models.issue import Issue, IssueStatus
from app.models.project import Project
from app.models.project_member import ProjectMember
from app.models.user import User, UserRole
from app.schemas.dashboard import DashboardSummary, RecentIssuesResponse
from app.schemas.issue import IssueOut

router = APIRouter(prefix="/dashboard", tags=["dashboard"])


def _visible_project_ids(db: Session, current_user: User) -> list[int] | None:
    """Returns None to mean "all projects" (admin), else an explicit id list."""
    if current_user.role == UserRole.ADMIN:
        return None
    rows = db.query(ProjectMember.project_id).filter(ProjectMember.user_id == current_user.id).all()
    return [r[0] for r in rows]


@router.get("/summary", response_model=DashboardSummary)
def get_summary(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)) -> DashboardSummary:
    project_ids = _visible_project_ids(db, current_user)

    project_query = db.query(Project)
    issue_query = db.query(Issue)
    if project_ids is not None:
        project_query = project_query.filter(Project.id.in_(project_ids))
        issue_query = issue_query.filter(Issue.project_id.in_(project_ids))

    total_projects = project_query.count()

    counts = dict(
        issue_query.with_entities(Issue.status, func.count(Issue.id)).group_by(Issue.status).all()
    )

    return DashboardSummary(
        total_projects=total_projects,
        total_issues=sum(counts.values()),
        todo=counts.get(IssueStatus.TODO, 0),
        in_progress=counts.get(IssueStatus.IN_PROGRESS, 0),
        review=counts.get(IssueStatus.REVIEW, 0),
        done=counts.get(IssueStatus.DONE, 0),
    )


@router.get("/my-issues", response_model=RecentIssuesResponse)
def get_my_issues(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)) -> RecentIssuesResponse:
    issues = (
        db.query(Issue)
        .filter(Issue.assignee_id == current_user.id)
        .order_by(Issue.updated_at.desc())
        .all()
    )
    return RecentIssuesResponse(issues=[IssueOut.model_validate(i) for i in issues])


@router.get("/recent-issues", response_model=RecentIssuesResponse)
def get_recent_issues(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
    limit: int = Query(default=10, ge=1, le=50),
) -> RecentIssuesResponse:
    project_ids = _visible_project_ids(db, current_user)

    query = db.query(Issue)
    if project_ids is not None:
        query = query.filter(Issue.project_id.in_(project_ids))

    issues = query.order_by(Issue.created_at.desc()).limit(limit).all()
    return RecentIssuesResponse(issues=[IssueOut.model_validate(i) for i in issues])
