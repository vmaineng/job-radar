from scores_adzuna import run_search_profile
import os
from storage import job_already_seen


SEARCH_TITLES = [t.strip() for t in os.getenv("SEARCH_TITLES", "").split(',') if t.strip()]
SEARCH_LOCATION = os.getenv("SEARCH_LOCATION", "Los Angeles")
INCLUDE_REMOTE = os.getenv("INCLUDE_REMOTE", "true").lower() == 'true'

DEFAULT_SEARCH_TITLES = [t.strip() for t in os.getenv("SEARCH_TITLES", "").split(',') if t.strip()]
DEFAULT_SEARCH_LOCATION = os.getenv("SEARCH_LOCATION", "Los Angeles")
DEFAULT_INCLUDE_REMOTE = os.getenv("INCLUDE_REMOTE", "true").lower() == 'true'


async def search_jobs_handler(
    search_titles: list[str] | None = None,
    search_location: str | None = None,
    include_remote: bool | None = None,
) -> dict:
    titles = search_titles or DEFAULT_SEARCH_TITLES
    location = search_location or DEFAULT_SEARCH_LOCATION
    remote = include_remote if include_remote is not None else DEFAULT_INCLUDE_REMOTE


    raw_jobs = await run_search_profile(SEARCH_TITLES, SEARCH_LOCATION, INCLUDE_REMOTE)
    new_jobs = [j for j in raw_jobs if not job_already_seen(j["source"], j["external_id"])]

    return {
        "count": len(raw_jobs),
        "jobs": raw_jobs,
    }
