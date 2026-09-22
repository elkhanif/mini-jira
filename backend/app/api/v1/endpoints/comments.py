from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.api.deps import get_current_user, require_issue_project_member
from app.db.session import get_db
from app.models.comment import Comment
from app.models.issue import Issue
from app.models.user import User
from app.schemas.comment import CommentCreate, CommentOut
from app.services.history_service import log_history

router = APIRouter(tags=["comments"])


@router.get("/issues/{issue_id}/comments", response_model=list[CommentOut])
def list_comments(issue: Issue = Depends(require_issue_project_member), db: Session = Depends(get_db)) -> list[CommentOut]:
    comments = (
        db.query(Comment).filter(Comment.issue_id == issue.id).order_by(Comment.created_at).all()
    )
    return [CommentOut.model_validate(c) for c in comments]


@router.post("/issues/{issue_id}/comments", response_model=CommentOut, status_code=status.HTTP_201_CREATED)
def create_comment(
    payload: CommentCreate,
    issue: Issue = Depends(require_issue_project_member),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> CommentOut:
    comment = Comment(issue_id=issue.id, user_id=current_user.id, body=payload.body)
    db.add(comment)

    log_history(
        db,
        issue_id=issue.id,
        actor_id=current_user.id,
        field_changed="comment_added",
        old_value=None,
        new_value=None,
    )

    db.commit()
    db.refresh(comment)
    return CommentOut.model_validate(comment)
