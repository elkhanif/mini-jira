from datetime import datetime

from pydantic import BaseModel, Field

from app.schemas.user import UserOut


class ProjectCreate(BaseModel):
    key: str = Field(min_length=1, max_length=10, pattern=r"^[A-Z0-9]+$")
    name: str = Field(min_length=1, max_length=200)
    description: str | None = None


class ProjectUpdate(BaseModel):
    name: str | None = Field(default=None, min_length=1, max_length=200)
    description: str | None = None


class ProjectOut(BaseModel):
    id: int
    key: str
    name: str
    description: str | None
    created_by: int
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class ProjectMemberOut(BaseModel):
    id: int
    user: UserOut
    joined_at: datetime

    model_config = {"from_attributes": True}


class ProjectMemberCreate(BaseModel):
    user_id: int
