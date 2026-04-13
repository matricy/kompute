from __future__ import annotations

from fastapi import APIRouter

import store
from models import Workload

router = APIRouter(prefix="/api/workloads", tags=["workloads"])


@router.get("", response_model=list[Workload])
async def list_workloads() -> list[Workload]:
    return list(store.workloads.values())
