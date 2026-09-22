from pydantic import BaseModel

from app.schemas.issue import IssueOut


class DashboardSummary(BaseModel):
    total_projects: int
    total_issues: int
    todo: int
    in_progress: int
    review: int
    done: int


class RecentIssuesResponse(BaseModel):
    issues: list[IssueOut]
