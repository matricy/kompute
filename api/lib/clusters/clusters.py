from datetime import UTC, datetime

from fastapi import HTTPException

from lib.config import KUBECONFIG_DIR, SSH_DIR
from models import ClusterCreate
from models.config import ClusterRecord


def create_cluster(req: ClusterCreate, existing: list[ClusterRecord]) -> ClusterRecord:
    slug = req.name.strip().lower().replace(" ", "-")
    cluster_id = f"cl_{slug}"

    if any(r.id == cluster_id for r in existing):
        raise HTTPException(status_code=409, detail="cluster name already exists")

    return ClusterRecord(
        id=cluster_id,
        name=req.name,
        version=req.version,
        labels=req.labels,
        kubeconfig_path=str(KUBECONFIG_DIR / f"{cluster_id}.yaml"),
        ssh_key_path=str(SSH_DIR / cluster_id),
        node_token_keyring_ref=f"kompute:{cluster_id}:node-token",
        created_at=datetime.now(UTC),
    )


def delete_cluster(ref: ClusterRecord) -> None:
    # TODO: Delete the cluster and nodes beneath it across providers
    pass
