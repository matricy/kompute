from __future__ import annotations

from datetime import datetime
from enum import StrEnum

from pydantic import BaseModel, Field


class ClusterStatus(StrEnum):
    HEALTHY = "healthy"
    DEGRADED = "degraded"
    DOWN = "down"
    PROVISIONING = "provisioning"
    EMPTY = "empty"


class Cluster(BaseModel):
    id: str
    name: str
    status: ClusterStatus
    version: str
    created_at: datetime
    control_plane_endpoint: str | None = None
    labels: dict[str, str] = Field(default_factory=dict)


class ClusterCreate(BaseModel):
    name: str
    version: str = "k3s v1.28"
    labels: dict[str, str] = Field(default_factory=dict)


class ClusterHealth(BaseModel):
    status: ClusterStatus
    node_count: int
    version: str


class RootInfo(BaseModel):
    service: str
    version: str
