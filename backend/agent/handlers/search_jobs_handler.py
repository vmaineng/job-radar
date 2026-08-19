from scores_adzuna import run_search_profile
import os
from storage import job_already_seen


SEARCH_TITLES = [t.strip() for t in os.getenv("SEARCH_TITLES", "").split(',') if t.strip()]
SEARCH_LOCATION = os.getenv("SEARCH_LOCATION", "Los Angeles")
INCLUDE_REMOTE = os.getenv("INCLUDE_REMOTE", "true").lower() == 'true'

async def search_jobs_handler(
    titles: list[str], location: str, include_remote: bool = True
) -> dict:
    """
    Tool handler for `search_jobs`. Wraps your existing Adzuna search
    and returns a plain dict Claude can read as a tool result.
    """
    raw_jobs = await run_search_profile(SEARCH_TITLES, SEARCH_LOCATION, INCLUDE_REMOTE)
    new_jobs = [j for j in raw_jobs if not job_already_seen(j["source"], j["external_id"])]

    return {
        "count": len(raw_jobs),
        "jobs": raw_jobs,
    }
