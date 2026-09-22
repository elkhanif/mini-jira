from sqlalchemy.orm import Session

from app.models.issue_history import IssueHistory


def log_history(
    db: Session,
    *,
    issue_id: int,
    actor_id: int,
    field_changed: str,
    old_value: str | None,
    new_value: str | None,
) -> None:
    entry = IssueHistory(
        issue_id=issue_id,
        actor_id=actor_id,
        field_changed=field_changed,
        old_value=old_value,
        new_value=new_value,
    )
    db.add(entry)
