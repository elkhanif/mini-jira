from datetime import date, datetime

from pydantic import BaseModel, Field

from app.models.issue import IssuePriority, IssueStatus, IssueType
from app.schemas.user import UserOut


class IssueCreate(BaseModel):
    title: str = Field(min_length=1, max_length=255)
    description: str | None = None
    type: IssueType
    priority: IssuePriority = IssuePriority.MEDIUM
    assignee_id: int | None = None
    due_date: date | None = None


class IssueUpdate(BaseModel):
    title: str | None = Field(default=None, min_length=1, max_length=255)
    description: str | None = None
    type: IssueType | None = None
    priority: IssuePriority | None = None
    assignee_id: int | None = None
    due_date: date | None = None


class IssueStatusUpdate(BaseModel):
    status: IssueStatus


class IssueOut(BaseModel):
    id: int
    project_id: int
    issue_key: str
    title: str
    description: str | None
    type: IssueType
    priority: IssuePriority
    status: IssueStatus
    assignee: UserOut | None
    reporter: UserOut
    due_date: date | None
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}
