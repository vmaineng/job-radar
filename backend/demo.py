import asyncio
from datetime import date, datetime, timezone
from fastapi import APIRouter
from pydantic import BaseModel

from demo_fixtures import DEMO_TRACES
from storage import supabase

router = APIRouter(prefix="/api", tags=["demo"])

STEP_DELAY_SECONDS = 0.6

class DemoRunRequest(BaseModel):
    email: str
    preset: str

    @property
    def is_valid_email(self) -> bool:
        return "@" in self.email and "." in self.email.split("@")[-1]


@router.post("/demo-run")
async def demo_run(req: DemoRunRequest):
    if req.preset not in DEMO_TRACES:
        return {"status": "error", "message": "Invalid preset."}

    if not req.is_valid_email:
            return {"status": "error", "message": "Please enter a valid email."} 
    

    existing = supabase.table("demo_runs").select("id").eq("email", req.email).execute()
    if existing.data:
        return {"status": "already_used", "message": "This email has already used its demo run."}

    fixture = DEMO_TRACES[req.preset]

    for _ in fixture["trace"]:
        await asyncio.sleep(STEP_DELAY_SECONDS)

    supabase.table("demo_runs").insert({
        "email": req.email,
        "preset": req.preset,
        "requested_at": datetime.now(timezone.utc).isoformat(),
    }).execute()

    return {
        "status": "success",
        "candidate_profile": fixture["candidate_profile"],
        "saved_count": fixture["saved_count"],
        "trace": fixture["trace"],
    }