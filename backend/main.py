from dotenv import load_dotenv

load_dotenv()

import asyncio
from datetime import datetime, timezone

from fastapi import Depends, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from slowapi.middleware import SlowAPIMiddleware

from agent.runner import run_job_radar_agent
from auth import get_current_user
from demo import router as demo_router
from limiter import limiter
from storage import get_dashboard_jobs, supabase
from search_profile import router as search_profile_router

app = FastAPI(title="Job Radar")

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)
app.add_middleware(SlowAPIMiddleware)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://job-radar-fawn.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(demo_router) 
app.include_router(search_profile_router) 


@app.get("/api/jobs")
def list_jobs(min_score: int = 50, max_age_days: int = 14, today_only: bool = False, user=Depends(get_current_user)):
    return get_dashboard_jobs(user_id =user.id, min_score=min_score, max_age_days=max_age_days, today_only=today_only)

@app.post("/api/run-now")
async def trigger_run(user=Depends(get_current_user)):
    if await asyncio.to_thread(_has_run_today, user.id):
        return {"status": "skipped", "reason": "already ran today"}
    profile = await asyncio.to_thread(_get_search_profile, user.id)
    if not profile:
        raise HTTPException(
            status_code=400,
            detail="No search profile set up yet — add one in settings first.",
        )
    result = await run_job_radar_agent(
        search_titles=[profile["title"]],
        search_location=profile["location"],
        include_remote=profile["remote_ok"],
        user_id=user.id,
    )
    await asyncio.to_thread(_log_run, user.id, result)
    return {"status": "complete", **result}