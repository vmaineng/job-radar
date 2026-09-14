from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field

from storage import supabase

from ..auth import get_current_user

router = APIRouter(prefix="/api/search-profile", tags=["search-profile"])

class SearchProfileIn(BaseModel):
    title: str = Field(..., min_length=2, max_length=100)
    location: str = Field(..., min_length=2, max_length=100)
    remote_ok: bool = True

class SearchProfileOut(SearchProfileIn):
    updated_at: datetime

@router.get("", response_model=SearchProfileOut | None)
async def get_search_profile(user=Depends(get_current_user)):
    res = (
        supabase.table("search_profiles")
        .select("*")
        .eq("user_id", user.id)
        .maybe_single()
        .execute()
    )
    return res.data

@router.put("", response_model=SearchProfileOut)
async def upsert_search_profile(body: SearchProfileIn, user=Depends(get_current_user)):
    row = {
        "user_id": user.id,
        "title": body.title.strip(),
        "location": body.location.strip(),
        "remote_ok": body.remote_ok,
        "updated_at": datetime.now(timezone.utc).isoformat(),
    }
    res = supabase.table("search_profiles").upsert(row).execute()
    if not res.data:
        raise HTTPException(status_code=500, detail="Failed to save search profile")
    return res.data[0]