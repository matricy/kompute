from __future__ import annotations

from fastapi import APIRouter

import store
from models import Token

router = APIRouter(prefix="/api/tokens", tags=["tokens"])


@router.get("", response_model=list[Token])
async def list_tokens() -> list[Token]:
    return list(store.tokens.values())
