from datetime import datetime

from pydantic import BaseModel

from app.schemas.user import UserOut


class IssueHistoryOut(BaseModel):
    id: int
    actor: UserOut
    field_changed: str
    old_value: str | None
    new_value: str | None
    created_at: datetime

    model_config = {"from_attributes": True}
