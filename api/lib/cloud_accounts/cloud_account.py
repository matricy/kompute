from fastapi import HTTPException

from lib.cloud_accounts.digital_ocean import create_digital_ocean_cloud_account
from lib.cloud_accounts.keyring import delete_token_from_keyring
from models.cloud_account import CloudAccount, CloudAccountRequest, CloudProvider
from models.config import CloudAccountRef


def create_cloud_account(req: CloudAccountRequest) -> CloudAccount:
    match req.provider:
        case CloudProvider.DIGITAL_OCEAN:
            return create_digital_ocean_cloud_account(req)
        case _:
            raise HTTPException(status_code=400, detail=f"Provider {req.provider} not yet supported")


def delete_cloud_account(ref: CloudAccountRef) -> None:
    delete_token_from_keyring("kompute", ref.id)
