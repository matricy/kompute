from datetime import datetime
from typing import Literal

from pydantic import BaseModel, ConfigDict, Field

from models.cloud_account import CloudProvider


class CloudAccountRef(BaseModel):
    id: str
    provider: CloudProvider
    keyring_ref: str
    name: str
    created_at: datetime


class ClusterRecord(BaseModel):
    id: str
    name: str
    provider: CloudProvider
    cloud_account_id: str
    kubeconfig_path: str
    ssh_key_path: str
    node_token_keyring_ref: str
    created_at: datetime


class Config(BaseModel):
    model_config = ConfigDict(strict=True, extra="forbid")

    schema_version: Literal[1] = 1
    clusters: list[ClusterRecord] = Field(default_factory=list)
    cloud_accounts: list[CloudAccountRef] = Field(default_factory=list)
