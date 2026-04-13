from __future__ import annotations

import asyncio
from datetime import UTC, datetime

from fastapi import APIRouter, HTTPException

import store
from models import Cluster, ClusterCreate, ClusterHealth

router = APIRouter(prefix="/api/clusters", tags=["clusters"])

_cluster_tasks: set[asyncio.Task[None]] = set()


async def _finish_cluster_bootstrap(cluster_id: str) -> None:
    await asyncio.sleep(2.5)
    cluster = store.clusters.get(cluster_id)
    if cluster is None:
        return
    cluster.status = "healthy"


@router.get("", response_model=list[Cluster])
async def list_clusters() -> list[Cluster]:
    return list(store.clusters.values())


@router.post("", response_model=Cluster, status_code=201)
async def create_cluster(req: ClusterCreate) -> Cluster:
    slug = req.name.strip().lower().replace(" ", "-")
    cluster_id = f"cl_{slug}"
    if cluster_id in store.clusters:
        raise HTTPException(status_code=409, detail="cluster name already exists")
    cluster = Cluster(
        id=cluster_id,
        name=req.name,
        status="provisioning",
        version=req.version,
        created_at=datetime.now(UTC),
        labels=req.labels,
    )
    store.clusters[cluster.id] = cluster
    task = asyncio.create_task(_finish_cluster_bootstrap(cluster.id))
    _cluster_tasks.add(task)
    task.add_done_callback(_cluster_tasks.discard)
    return cluster


@router.get("/{cluster_id}", response_model=Cluster)
async def get_cluster(cluster_id: str) -> Cluster:
    cluster = store.clusters.get(cluster_id)
    if cluster is None:
        raise HTTPException(status_code=404, detail="cluster not found")
    return cluster


@router.delete("/{cluster_id}", status_code=204)
async def delete_cluster(cluster_id: str) -> None:
    if cluster_id not in store.clusters:
        raise HTTPException(status_code=404, detail="cluster not found")
    for node_id in [n.id for n in store.nodes_for_cluster(cluster_id)]:
        del store.nodes[node_id]
    del store.clusters[cluster_id]


@router.get("/{cluster_id}/health", response_model=ClusterHealth)
async def cluster_health(cluster_id: str) -> ClusterHealth:
    cluster = store.clusters.get(cluster_id)
    if cluster is None:
        raise HTTPException(status_code=404, detail="cluster not found")
    return ClusterHealth(
        status=cluster.status,
        node_count=len(store.nodes_for_cluster(cluster_id)),
        version=cluster.version,
    )
