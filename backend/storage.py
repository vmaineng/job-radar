import os
from datetime import datetime, timedelta, timezone
from supabase import create_client, Client
import logging   

logger = logging.getLogger(__name__)

url ,key = os.getenv("SUPABASE_URL"), os.getenv("SUPABASE_SERVICE_KEY")
if not url or not key:
    raise RuntimeError("SUPABASE_URL and SUPABASE_SERVICE_KEY must be set")
supabase: Client = create_client(url,key)


def job_already_seen(source: str, external_id: str) -> bool:
    try: 
        res = (
        supabase.table("jobs")
        .select("id")
        .eq("source", source)
        .eq("external_id", external_id)
        .execute()
    )
        return len(res.data) > 0
    except Exception as e:
        logger.error(f"job_already_seen failed for {source}/{external_id}: {e}")
        return False


def save_job(job: dict) -> str | None:
    """Insert a new job row, return its id."""
    try:
        res = supabase.table("jobs").insert(job).execute()
        return res.data[0]["id"]
    except Exception as e:
        logger.error(f"save_job failed for {job.get('external_id')}: {e}")
        return None



def save_contact(job_id: str, contact: dict):
    contact["job_id"] = job_id
    supabase.table("contacts").insert(contact).execute()


def get_dashboard_jobs(min_score: int = 50, max_age_days: int = 14, today_only: bool = False):
    """Fetch recent, relevant jobs with their contacts for the dashboard."""
    if today_only:
        now = datetime.now(timezone.utc)
        cutoff = now.replace(hour=0, minute=0, second=0, microsecond=0).isoformat()
    else:
        cutoff = (datetime.now(timezone.utc) - timedelta(days=max_age_days)).isoformat()
    jobs = (
        supabase.table("jobs")
        .select("*, contacts(*)")
        .gte("relevance_score", min_score)
        .gte("found_at", cutoff)
        .order("found_at", desc=True)
        .limit(100)
        .execute()
    )
    return jobs.data
