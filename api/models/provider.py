from __future__ import annotations

from pydantic import BaseModel

from .node import NodeProvider


class ProviderRegion(BaseModel):
    value: str
    label: str


class ProviderSize(BaseModel):
    value: str
    label: str
    specs: str


class ProviderOption(BaseModel):
    id: NodeProvider
    label: str
    description: str
    regions: list[ProviderRegion]
    sizes: list[ProviderSize]
