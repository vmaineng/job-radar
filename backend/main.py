from dotenv import load_dotenv

load_dotenv()

import asyncio

import logging
import sentry_sdk
from sentry_sdk.integrations.logging import LoggingIntegration

from fastapi import Depends, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from slowapi.middleware import SlowAPIMiddleware

from agent.runner import run_job_radar_agent
from auth import get_current_user
from demo import router as demo_router
from limiter import limiter
from storage import get_dashboard_jobs
from search_profile import router as search_profile_router
from pipeline_logic import has_run_today, get_search_profile, log_run, get_user_api_key

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


sentry_logging = LoggingIntegration(
    level=logging.INFO,        # capture INFO and above as breadcrumbs
    event_level=logging.ERROR, # send ERROR and above as actual Sentry events
)

sentry_sdk.init(
    dsn=os.getenv("SENTRY_DSN"),
    integrations=[sentry_logging],
    traces_sample_rate=0.1,
    send_default_pii=False,
)

@app.get("/api/jobs")
def list_jobs(
    min_score: int = 50,
    max_age_days: int = 14,
    today_only: bool = False,
    user=Depends(get_current_user),
):
    return get_dashboard_jobs(
        user_id=user.id,
        min_score=min_score,
        max_age_days=max_age_days,
        today_only=today_only,
    )


@app.post("/api/run-now")
async def trigger_run(user=Depends(get_current_user)):
    sentry_sdk.set_user({"id": user.id, "email": user.email})

    if await asyncio.to_thread(has_run_today, user.id):
        return {"status": "skipped", "reason": "already ran today"}
    profile = await asyncio.to_thread(get_search_profile, user.id)
    if not profile:
        raise HTTPException(
            status_code=400,
            detail="No search profile set up yet — add one in settings first.",
        )
    api_key = await asyncio.to_thread(get_user_api_key, user.id)
    if not api_key:
        raise HTTPException(
            status_code=400,
            detail="Add your Anthropic API key in settings before running a search.",
        )

    sentry_sdk.set_context("search_profile", {
        "title": profile["title"],
        "location": profile["location"],
        "remote_ok": profile["remote_ok"],
    })
    result = await run_job_radar_agent(
        search_titles=[profile["title"]],
        search_location=profile["location"],
        include_remote=profile["remote_ok"],
        background=profile.get("background"),
        user_id=user.id,
        api_key=api_key,
    )
    await asyncio.to_thread(log_run, user.id, result)
    return {"status": "complete", **result}
