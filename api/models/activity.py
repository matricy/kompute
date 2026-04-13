from __future__ import annotations

from datetime import datetime
from typing import Literal

from pydantic import BaseModel

ActivityLevel = Literal["info", "warn", "error"]


class ActivityEntry(BaseModel):
    id: str
    cluster_id: str
    timestamp: datetime
    level: ActivityLevel
    node: str
    message: str
