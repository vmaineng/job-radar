# demo.py
from datetime import date, datetime, timezone
from fastapi import APIRouter
from pydantic import BaseModel, EmailStr

from agent.runner import run_job_radar_agent, CANDIDATE_PROFILE
from storage import supabase

router = APIRouter(prefix="/api", tags=["demo"])

DEMO_PRESETS = {
    "junior_swe_la": {"title": "Junior Software Engineer", "location": "Los Angeles"},
    "associate_swe_remote": {"title": "Associate Software Engineer", "location": "Remote"},
    "solutions_analyst": {"title": "Solutions Analyst I", "location": "Los Angeles"},
}

class DemoRunRequest(BaseModel):
    email: EmailStr
    preset: str


@router.post("/demo-run")
async def demo_run(req: DemoRunRequest):
    if req.preset not in DEMO_PRESETS:
        return {"status": "error", "message": "Invalid preset."}

    existing = supabase.table("demo_runs").select("id").eq("email", req.email).execute()
    if existing.data:
        return {"status": "already_used", "message": "This email has already used its demo run."}

    preset = DEMO_PRESETS[req.preset]

    result = await run_job_radar_agent(
        search_titles=[preset["title"]],
        search_location=preset["location"],
        skip_enrichment=True,
        demo_mode=True,
    )

    supabase.table("demo_runs").insert({
        "email": req.email,
        "search_titles": preset["title"],
        "search_location": preset["location"],
        "result": result,
    }).execute()

    return {"status": "complete", "candidate_profile": CANDIDATE_PROFILE, **result}