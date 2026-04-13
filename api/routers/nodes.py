from __future__ import annotations

import asyncio
from datetime import UTC, datetime
from uuid import uuid4

from fastapi import APIRouter, HTTPException

import store
from models import Node, ProvisionRequest

router = APIRouter(prefix="/api/clusters/{cluster_id}/nodes", tags=["nodes"])

# Strong refs to in-flight provisioning tasks so the event loop doesn't GC them.
_provisioning_tasks: set[asyncio.Task[None]] = set()


_REGION_IPS = {
    "nyc3": "165.227.",
    "sfo3": "159.203.",
    "fsn1": "78.46.",
    "nbg1": "116.203.",
    "us-east-1": "52.90.",
}


def _require_cluster(cluster_id: str) -> None:
    if cluster_id not in store.clusters:
        raise HTTPException(status_code=404, detail="cluster not found")


async def _finish_provisioning(node_id: str) -> None:
    await asyncio.sleep(2.0)
    node = store.nodes.get(node_id)
    if node is None:
        return
    node.status = "online"
    node.cpu_percent = 4.2
    node.memory_used_gb = round(node.memory_gb * 0.12, 2)


@router.get("", response_model=list[Node])
async def list_nodes(cluster_id: str) -> list[Node]:
    _require_cluster(cluster_id)
    return store.nodes_for_cluster(cluster_id)


@router.get("/{node_id}", response_model=Node)
async def get_node(cluster_id: str, node_id: str) -> Node:
    _require_cluster(cluster_id)
    node = store.nodes.get(node_id)
    if node is None or node.cluster_id != cluster_id:
        raise HTTPException(status_code=404, detail="node not found")
    return node


@router.post("/provision", response_model=Node, status_code=201)
async def provision_node(cluster_id: str, req: ProvisionRequest) -> Node:
    _require_cluster(cluster_id)
    size_to_spec = {
        "s-1vcpu-1gb": (1, 1.0),
        "s-2vcpu-4gb": (2, 4.0),
        "s-4vcpu-8gb": (4, 8.0),
        "cx21": (2, 4.0),
        "cx31": (2, 8.0),
        "cx41": (4, 16.0),
        "t3.small": (2, 2.0),
        "t3.medium": (2, 4.0),
        "t3.large": (2, 8.0),
    }
    cores, mem = size_to_spec.get(req.size, (2, 4.0))
    prefix = _REGION_IPS.get(req.region, "10.0.0.")
    node = Node(
        id=str(uuid4()),
        cluster_id=cluster_id,
        name=req.name,
        provider=req.provider,
        status="provisioning",
        role="worker",
        region=req.region,
        cpu_cores=cores,
        cpu_percent=0.0,
        memory_gb=mem,
        memory_used_gb=0.0,
        workload_count=0,
        joined_at=datetime.now(UTC),
        ip_address=f"{prefix}{(hash(req.name) % 254) + 1}",
        labels={"role": "worker", "zone": "cloud"},
    )
    store.nodes[node.id] = node
    task = asyncio.create_task(_finish_provisioning(node.id))
    _provisioning_tasks.add(task)
    task.add_done_callback(_provisioning_tasks.discard)
    return node


@router.delete("/{node_id}", status_code=204)
async def remove_node(cluster_id: str, node_id: str) -> None:
    _require_cluster(cluster_id)
    node = store.nodes.get(node_id)
    if node is None or node.cluster_id != cluster_id:
        raise HTTPException(status_code=404, detail="node not found")
    del store.nodes[node_id]


@router.post("/{node_id}/drain", response_model=Node)
async def drain_node(cluster_id: str, node_id: str) -> Node:
    _require_cluster(cluster_id)
    node = store.nodes.get(node_id)
    if node is None or node.cluster_id != cluster_id:
        raise HTTPException(status_code=404, detail="node not found")
    node.status = "draining"
    return node
