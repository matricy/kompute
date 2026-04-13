from __future__ import annotations

from fastapi import APIRouter, HTTPException

import store
from models import ActivityEntry

router = APIRouter(prefix="/api/clusters/{cluster_id}/activity", tags=["activity"])


@router.get("", response_model=list[ActivityEntry])
async def list_activity(cluster_id: str, limit: int = 50) -> list[ActivityEntry]:
    if cluster_id not in store.clusters:
        raise HTTPException(status_code=404, detail="cluster not found")
    return store.activity_for_cluster(cluster_id, limit=limit)
