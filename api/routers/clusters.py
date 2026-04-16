from fastapi import APIRouter, HTTPException, Request

from lib.clusters.clusters import create_cluster, delete_cluster
from lib.config import save_config
from models import Cluster, ClusterCreate, ClusterStatus
from models.config import ClusterRecord, Config

router = APIRouter(prefix="/api/clusters", tags=["clusters"])


def _to_cluster(rec: ClusterRecord) -> Cluster:
    return Cluster(
        id=rec.id,
        name=rec.name,
        status=ClusterStatus.EMPTY,
        version=rec.version,
        created_at=rec.created_at,
        labels=rec.labels,
    )


@router.get("", response_model=list[Cluster])
def list_clusters(request: Request) -> list[Cluster]:
    return [_to_cluster(r) for r in request.app.state.config.clusters]


@router.post("", response_model=Cluster, status_code=201)
def post_cluster(req: ClusterCreate, request: Request) -> Cluster:
    config: Config = request.app.state.config
    record = create_cluster(req, config.clusters)
    config.clusters.append(record)
    save_config(config)
    return _to_cluster(record)


@router.get("/{cluster_id}", response_model=Cluster)
def get_cluster(cluster_id: str, request: Request) -> Cluster:
    for ref in request.app.state.config.clusters:
        if ref.id == cluster_id:
            return _to_cluster(ref)
    raise HTTPException(status_code=404, detail="cluster not found")


@router.delete("/{cluster_id}", status_code=204)
def delete_cluster_route(cluster_id: str, request: Request) -> None:
    config = request.app.state.config
    ref = next((r for r in config.clusters if r.id == cluster_id), None)
    if ref is None:
        raise HTTPException(status_code=404, detail="cluster not found")
    delete_cluster(ref)
    config.clusters.remove(ref)
    save_config(config)
