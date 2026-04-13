from __future__ import annotations

from datetime import datetime

from pydantic import BaseModel


class Token(BaseModel):
    id: str
    name: str
    prefix: str
    created_at: datetime
    last_used_at: datetime | None = None
