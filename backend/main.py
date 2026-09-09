from dotenv import load_dotenv
load_dotenv()

import asyncio

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from datetime import datetime, timezone

from agent.runner import run_job_radar_agent
from storage import get_dashboard_jobs, supabase
from demo import router as demo_router

from limiter import limiter
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from slowapi.middleware import SlowAPIMiddleware


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

def _has_run_today() -> bool:
    today = datetime.now(timezone.utc).date().isoformat()
    res = (
        supabase.table("agent_runs")
        .select("id")
        .gte("ran_at", f"{today}T00:00:00")
        .execute()
    )
    return len(res.data) > 0

def _log_run(result: dict):
    supabase.table("agent_runs").insert({
        "ran_at": datetime.now(timezone.utc).isoformat(),
        **result,
    }).execute()

@app.get("/api/jobs")
def list_jobs(min_score: int = 50, max_age_days: int = 14, today_only: bool = False):
    return get_dashboard_jobs(min_score=min_score, max_age_days=max_age_days, today_only=today_only)

@app.post("/api/run-now")
async def trigger_run():
    if await asyncio.to_thread(_has_run_today()):
        return {"status": "skipped", "reason": "already ran today"}

    result = await run_job_radar_agent()
    await asyncio.to_thread(_log_run(result))
    return {"status": "complete", **result}