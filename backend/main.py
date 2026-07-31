from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from pipeline import run_pipeline
from storage import get_dashboard_jobs

app = FastAPI(title="Job Radar")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"]
)

@app.get("/api/jobs")
def list_jobs(min_score: int = 50, max_age_days: int = 14): 
    return get_dashboard_jobs(min_score=min_score, max_age_days=max_age_days)

@app.post("/api/run-now")
async def trigger_run():
    count = await run_pipeline()
    return {"new_jobs_found": count}