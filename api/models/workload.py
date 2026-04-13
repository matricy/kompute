from __future__ import annotations

from datetime import datetime
from typing import Literal

from pydantic import BaseModel

WorkloadStatus = Literal["running", "pending", "failed", "stopped"]


class Workload(BaseModel):
    id: str
    name: str
    image: str
    status: WorkloadStatus
    node_id: str
    replicas: int
    created_at: datetime
