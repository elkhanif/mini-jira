from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.issue import Issue
from app.models.project import Project
from app.models.user import User
from app.schemas.issue import IssueCreate
from app.services.history_service import log_history


def create_issue(db: Session, *, project: Project, data: IssueCreate, reporter: User) -> Issue:
    # Lock the project row so two concurrent issue creations in the same
    # project can't read-then-write the same issue_counter value.
    locked_project = db.execute(
        select(Project).where(Project.id == project.id).with_for_update()
    ).scalar_one()

    locked_project.issue_counter += 1
    next_number = locked_project.issue_counter

    issue = Issue(
        project_id=locked_project.id,
        number=next_number,
        title=data.title,
        description=data.description,
        type=data.type,
        priority=data.priority,
        assignee_id=data.assignee_id,
        reporter_id=reporter.id,
        due_date=data.due_date,
    )
    db.add(issue)
    db.flush()

    log_history(
        db,
        issue_id=issue.id,
        actor_id=reporter.id,
        field_changed="created",
        old_value=None,
        new_value=f"{locked_project.key}-{next_number:03d}",
    )

    db.commit()
    db.refresh(issue)
    return issue
