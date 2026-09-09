from fastapi import HTTPException, Header
from storage import supabase

async def get_current_user(authorization: str = Header(None)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Not authorized")
    token = authorization.removeprefix("Bearer ")
    try:
        user_response = supabase.auth.get_user(token)
    except Exception:
        raise HTTPException(status_code=401, detail ="Invalid or expired session")

    if not user_response.user:
        raise HTTPException(status_code=401, detail="Invalid or expired session")

    return user_response.user