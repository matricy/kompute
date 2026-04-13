"""In-memory state for the Kompute API. Swap for a real DB later."""

from __future__ import annotations

from datetime import UTC, datetime, timedelta
from uuid import uuid4

from models import Cluster, Node, Token, Workload


def _ago(days: float = 0, hours: float = 0, minutes: float = 0) -> datetime:
    return datetime.now(UTC) - timedelta(days=days, hours=hours, minutes=minutes)


clusters: dict[str, Cluster] = {}
nodes: dict[str, Node] = {}
workloads: dict[str, Workload] = {}
tokens: dict[str, Token] = {}


def seed() -> None:
    home_cluster = Cluster(
        id="cl_home_lab",
        name="home-lab",
        status="healthy",
        version="k3s v1.28",
        created_at=_ago(days=60),
        control_plane_endpoint="https://10.0.1.12:6443",
        labels={"zone": "home"},
    )
    cloud_cluster = Cluster(
        id="cl_prod_cloud",
        name="prod-cloud",
        status="degraded",
        version="k3s v1.28",
        created_at=_ago(days=41),
        control_plane_endpoint="https://78.46.12.88:6443",
        labels={"zone": "cloud"},
    )
    for c in (home_cluster, cloud_cluster):
        clusters[c.id] = c

    seeded: list[Node] = [
        Node(
            id=str(uuid4()),
            cluster_id=home_cluster.id,
            name="beelink-01",
            provider="home",
            status="online",
            role="control-plane",
            region="garage",
            cpu_cores=8,
            cpu_percent=34.2,
            memory_gb=32.0,
            memory_used_gb=11.4,
            workload_count=5,
            joined_at=_ago(days=21),
            ip_address="10.0.1.12",
            labels={"role": "control-plane", "zone": "home"},
        ),
        Node(
            id=str(uuid4()),
            cluster_id=home_cluster.id,
            name="old-thinkpad",
            provider="home",
            status="offline",
            role="worker",
            region="basement",
            cpu_cores=4,
            cpu_percent=0.0,
            memory_gb=16.0,
            memory_used_gb=0.0,
            workload_count=0,
            joined_at=_ago(days=112),
            ip_address="10.0.1.47",
            labels={"role": "worker", "zone": "home"},
        ),
        Node(
            id=str(uuid4()),
            cluster_id=cloud_cluster.id,
            name="hetzner-fsn-2",
            provider="hetzner",
            status="draining",
            role="control-plane",
            region="fsn1",
            cpu_cores=16,
            cpu_percent=18.0,
            memory_gb=64.0,
            memory_used_gb=22.7,
            workload_count=2,
            joined_at=_ago(days=41),
            ip_address="78.46.12.88",
            labels={"role": "control-plane", "zone": "cloud"},
        ),
        Node(
            id=str(uuid4()),
            cluster_id=cloud_cluster.id,
            name="do-nyc-1",
            provider="digitalocean",
            status="online",
            role="worker",
            region="nyc3",
            cpu_cores=4,
            cpu_percent=62.8,
            memory_gb=8.0,
            memory_used_gb=5.1,
            workload_count=3,
            joined_at=_ago(days=6),
            ip_address="165.227.44.18",
            labels={"role": "worker", "zone": "cloud"},
        ),
    ]
    for n in seeded:
        nodes[n.id] = n


def nodes_for_cluster(cluster_id: str) -> list[Node]:
    return [n for n in nodes.values() if n.cluster_id == cluster_id]


seed()
