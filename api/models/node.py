from __future__ import annotations

from datetime import datetime
from typing import Literal

from pydantic import BaseModel, Field

NodeProvider = Literal["home", "digitalocean", "hetzner", "aws"]
NodeStatus = Literal["online", "offline", "draining", "provisioning"]


NodeRole = Literal["control-plane", "worker"]


class Node(BaseModel):
    id: str
    cluster_id: str
    name: str
    provider: NodeProvider
    status: NodeStatus
    role: NodeRole
    region: str
    cpu_cores: int
    cpu_percent: float
    memory_gb: float
    memory_used_gb: float
    workload_count: int
    joined_at: datetime
    ip_address: str | None = None
    labels: dict[str, str] = Field(default_factory=dict)


class ProvisionRequest(BaseModel):
    provider: NodeProvider
    region: str
    size: str
    api_key: str
    name: str
