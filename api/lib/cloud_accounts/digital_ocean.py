import uuid
from datetime import datetime

from fastapi import HTTPException
from pydo import Client

from models.cloud_account import CloudAccount, CloudAccountRequest

from .keyring import create_token_in_keyring


def create_digital_ocean_cloud_account(req: CloudAccountRequest) -> CloudAccount:
    client = Client(token=req.token)
    try:
        client.account.get()
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid token") from None

    id = f"do-{uuid.uuid4().hex[:8]}"

    try:
        create_token_in_keyring("kompute", id, req.token)
    except Exception:
        raise HTTPException(status_code=500, detail="Failed to store token in keyring") from None

    return CloudAccount(
        id=id,
        provider=req.provider,
        name=req.name,
        created_at=str(datetime.now()),
    )
