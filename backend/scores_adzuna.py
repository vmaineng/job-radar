import os
import httpx

ADZUNA_APP_ID = os.getenv("ADZUNA_APP_ID")
ADZUNA_APP_KEY = os.getenv("ADZUNA_APP_KEY")
ADZUNA_COUNTRY = os.getenv("ADZUNA_COUNTRY", "us")

BASE_URL = f"https://api.adzuna.com/v1/api/jobs/{ADZUNA_COUNTRY}/search/1"

async def search_adzuna(title: str, location: str, results_per_page: int=20) -> list[dict]: 
    params = {
        "app_id": ADZUNA_APP_ID,
        "app_key": ADZUNA_APP_KEY,
        "what": title,
        "where": location,
        "results_per_page": results_per_page,
        "max_days_old": 1,  
        "sort_by": "date",
    }

    async with httpx.AsyncClient(timeout=20) as client:
        resp = await client.get(BASE_URL, params=params)
        resp.raise_for_status()
        data = resp.json()

    jobs = []
    for r in data.get("results", []):
        jobs.append({
            "source": "adzuna",
            "external_id": str(r.get("id")),
            "title": r.get("title", "").strip(),
            "company": (r.get("company") or {}).get("display_name", "Unknown"),
            "location": (r.get("location") or {}).get("display_name", ""),
            "is_remote": "remote" in (r.get("title", "") + r.get("description", "")).lower(),
            "description": r.get("description", ""),
            "apply_url": r.get("redirect_url", ""),
            "salary_min": r.get("salary_min"),
            "salary_max": r.get("salary_max"),
            "posted_at": r.get("created"),
        })
    return jobs

async def run_search_profile(titles: list[str], location: str, include_remote: bool = True) -> list[dict]:
    """Run every title in the search profile, once for the target location
    and once for 'remote', then combine results."""
    all_jobs = []
    locations = [location] + (["remote"] if include_remote else [])
    for title in titles:
        for loc in locations:
            try:
                jobs = await search_adzuna(title, loc)
                all_jobs.extend(jobs)
            except httpx.HTTPStatusError:
                # rate limit or bad request on this combo — skip and keep going
                continue
    return all_jobs

