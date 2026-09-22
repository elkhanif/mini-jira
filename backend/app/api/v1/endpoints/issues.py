from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.deps import (
    get_current_user,
    get_project_or_404,
    require_issue_project_member,
    require_project_member,
)
from app.db.session import get_db
from app.models.issue import Issue, IssuePriority, IssueStatus, IssueType
from app.models.project import Project
from app.models.user import User
from app.schemas.history import IssueHistoryOut
from app.schemas.issue import IssueCreate, IssueOut, IssueStatusUpdate, IssueUpdate
from app.services.history_service import log_history
from app.services.issue_service import create_issue

router = APIRouter(tags=["issues"])


@router.get("/projects/{project_id}/issues", response_model=list[IssueOut])
def list_issues(
    project: Project = Depends(require_project_member),
    db: Session = Depends(get_db),
    status_filter: IssueStatus | None = None,
    assignee_id: int | None = None,
    type_filter: IssueType | None = None,
    priority_filter: IssuePriority | None = None,
) -> list[IssueOut]:
    query = db.query(Issue).filter(Issue.project_id == project.id)
    if status_filter is not None:
        query = query.filter(Issue.status == status_filter)
    if assignee_id is not None:
        query = query.filter(Issue.assignee_id == assignee_id)
    if type_filter is not None:
        query = query.filter(Issue.type == type_filter)
    if priority_filter is not None:
        query = query.filter(Issue.priority == priority_filter)

    issues = query.order_by(Issue.number).all()
    return [IssueOut.model_validate(i) for i in issues]


@router.post("/projects/{project_id}/issues", response_model=IssueOut, status_code=status.HTTP_201_CREATED)
def create_issue_endpoint(
    payload: IssueCreate,
    project: Project = Depends(require_project_member),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> IssueOut:
    issue = create_issue(db, project=project, data=payload, reporter=current_user)
    return IssueOut.model_validate(issue)


@router.get("/issues/{issue_id}", response_model=IssueOut)
def get_issue(issue: Issue = Depends(require_issue_project_member)) -> IssueOut:
    return IssueOut.model_validate(issue)


@router.put("/issues/{issue_id}", response_model=IssueOut)
def update_issue(
    payload: IssueUpdate,
    issue: Issue = Depends(require_issue_project_member),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> IssueOut:
    changes = payload.model_dump(exclude_unset=True)

    if "assignee_id" in changes and changes["assignee_id"] != issue.assignee_id:
        log_history(
            db,
            issue_id=issue.id,
            actor_id=current_user.id,
            field_changed="assignee",
            old_value=str(issue.assignee_id) if issue.assignee_id else None,
            new_value=str(changes["assignee_id"]) if changes["assignee_id"] else None,
        )
    if "priority" in changes and changes["priority"] != issue.priority:
        log_history(
            db,
            issue_id=issue.id,
            actor_id=current_user.id,
            field_changed="priority",
            old_value=issue.priority.value,
            new_value=changes["priority"].value if hasattr(changes["priority"], "value") else changes["priority"],
        )

    for field, value in changes.items():
        setattr(issue, field, value)

    db.commit()
    db.refresh(issue)
    return IssueOut.model_validate(issue)


@router.patch("/issues/{issue_id}/status", response_model=IssueOut)
def update_issue_status(
    payload: IssueStatusUpdate,
    issue: Issue = Depends(require_issue_project_member),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> IssueOut:
    if payload.status == issue.status:
        return IssueOut.model_validate(issue)

    log_history(
        db,
        issue_id=issue.id,
        actor_id=current_user.id,
        field_changed="status",
        old_value=issue.status.value,
        new_value=payload.status.value,
    )
    issue.status = payload.status
    db.commit()
    db.refresh(issue)
    return IssueOut.model_validate(issue)


@router.get("/issues/{issue_id}/history", response_model=list[IssueHistoryOut])
def get_issue_history(
    issue: Issue = Depends(require_issue_project_member),
) -> list[IssueHistoryOut]:
    return [IssueHistoryOut.model_validate(h) for h in issue.history]
