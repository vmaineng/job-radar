from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field

from storage import supabase
from auth import get_current_user

router = APIRouter(prefix="/api/user-settings", tags=["user-settings"])

class UserSettingsIn(BaseModel):
    anthropic_api_key: str = Field(..., min_length=10, max_length=200)

class UserSettingsOut(BaseModel):
    has_api_key: bool
    updated_at: datetime | None = None

@router.get("", response_model=UserSettingsOut)
async def get_user_settings(user=Depends(get_current_user)):
    res = (
        supabase.table("user_settings")
        .select("anthropic_api_key, updated_at")
        .eq("user_id", user.id)
        .maybe_single()
        .execute()
    )
    if res is None or not res.data:
        return UserSettingsOut(has_api_key=False, updated_at=None)
    return UserSettingsOut(
        has_api_key=bool(res.data.get("anthropic_api_key")),
        updated_at=res.data.get("updated_at"),
    )

@router.put("", response_model=UserSettingsOut)
async def upsert_user_settings(body: UserSettingsIn, user=Depends(get_current_user)):
    row = {
        "user_id": user.id,
        "anthropic_api_key": body.anthropic_api_key.strip(),
        "updated_at": datetime.now(timezone.utc).isoformat(),
    }
    res = supabase.table("user_settings").upsert(row).execute()
    if not res.data:
        raise HTTPException(status_code=500, detail="Failed to save API key")
    return UserSettingsOut(has_api_key=True, updated_at=res.data[0]["updated_at"])