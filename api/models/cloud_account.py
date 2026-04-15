from enum import StrEnum

from pydantic import BaseModel


class CloudProvider(StrEnum):
    DIGITAL_OCEAN = "digital_ocean"
    HETZNER = "hetzner"
    AWS = "aws"


class CloudAccountRequest(BaseModel):
    provider: CloudProvider
    name: str
    token: str


class CloudAccount(BaseModel):
    id: str
    provider: CloudProvider
    name: str
    created_at: str
