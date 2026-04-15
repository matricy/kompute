from datetime import datetime

from fastapi import APIRouter, HTTPException, Request

from lib.cloud_accounts.cloud_account import create_cloud_account, delete_cloud_account
from lib.config import save_config
from models.cloud_account import CloudAccount, CloudAccountRequest
from models.config import CloudAccountRef

router = APIRouter(prefix="/api/cloud-accounts", tags=["cloud_accounts"])


@router.get("", response_model=list[CloudAccountRef])
def get_cloud_accounts(request: Request) -> list[CloudAccountRef]:
    return request.app.state.config.cloud_accounts


@router.get("/{account_id}", response_model=CloudAccountRef)
def get_cloud_account(account_id: str, request: Request) -> CloudAccountRef:
    for ref in request.app.state.config.cloud_accounts:
        if ref.id == account_id:
            return ref
    raise HTTPException(status_code=404, detail="Cloud account not found")


@router.post("", response_model=CloudAccount, status_code=201)
def post_cloud_account(req: CloudAccountRequest, request: Request) -> CloudAccount:
    account = create_cloud_account(req)
    ref = CloudAccountRef(
        id=account.id,
        provider=account.provider,
        keyring_ref=f"kompute:{account.id}",
        name=account.name,
        created_at=datetime.now(),
    )
    request.app.state.config.cloud_accounts.append(ref)
    save_config(request.app.state.config)
    return account


@router.delete("/{account_id}", status_code=204)
def delete_cloud_account_route(account_id: str, request: Request) -> None:
    config = request.app.state.config
    ref = next((r for r in config.cloud_accounts if r.id == account_id), None)
    if ref is None:
        raise HTTPException(status_code=404, detail="Cloud account not found")
    delete_cloud_account(ref)
    config.cloud_accounts.remove(ref)
    save_config(config)
