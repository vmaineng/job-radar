import os
from supabase import create_client, Client

supabase: Client = create_client(
    os.getenv("SUPABASE_URL"),
    os.getenv("SUPABASE_SERVICE_KEY"),
)


def job_already_seen(source: str, external_id: str) -> bool:
    res = (
        supabase.table("jobs")
        .select("id")
        .eq("source", source)
        .eq("external_id", external_id)
        .execute()
    )
    return len(res.data) > 0


def save_job(job: dict) -> str:
    """Insert a new job row, return its id."""
    res = supabase.table("jobs").insert(job).execute()
    return res.data[0]["id"]


def save_contact(job_id: str, contact: dict):
    contact["job_id"] = job_id
    supabase.table("contacts").insert(contact).execute()


def get_dashboard_jobs(min_score: int = 50):
    """Fetch recent, relevant jobs with their contacts for the dashboard."""
    jobs = (
        supabase.table("jobs")
        .select("*, contacts(*)")
        .gte("relevance_score", min_score)
        .order("found_at", desc=True)
        .limit(100)
        .execute()
    )
    return jobs.data
