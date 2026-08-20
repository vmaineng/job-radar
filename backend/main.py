from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from agent.runner import run_job_radar_agent
from storage import get_dashboard_jobs, supabase
from demo import router as demo_router

app = FastAPI(title="Job Radar")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(demo_router) 

def _has_run_today() -> bool:
    today = date.today().isoformat()
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
    if _has_run_today():
        return {"status": "skipped", "reason": "already ran today"}

    result = await run_job_radar_agent()
    _log_run(result)
    return {"status": "complete", **result}