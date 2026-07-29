import os
from backend.sources_adzuna.py import run_search_profile
from backend.score_jobs import score_job
from backend.enrich_contacts import find_contact
from backend.storage import job_already_seen, save_job, save_contact

SEARCH_TITLES = [t.strip() for t in os.getenv("SEARCH_TITLES", "").split(',') if t.strip()]
SEARCH_LOCATION = os.getenv("SEARCH_LOCATION", "Los Angeles")
INCLUDE_REMOTE = os.getenv("INCLUDE_REMOTE", "true").lower() == 'true'
MIN_SCORE_TO_ENRICH = 50 

async def run_pipeline():
    print("searching for new postings..")
    raw_jobs = await run_search_profile(SEARCH_TITLES, SEARCH_LOCATION, INCLUDE_REMOTE)
    print(f"found {len(raw_jobs)} raw results")

    new_count = 0

    for job in raw_jobs:
        if job_already_seen(job['source'], job['external_id']):
            continue
        print(f"scoring {job["title"]} at {job['company']}...")
        scored = score_job(job["title"], job["description"])
        job["relevance_score"] = scored.get("score", 0)
        job["relevance_reason"] = scored.get('reason', "")

        job_id = save_job(job)
        new_count += 1

        if job["relevance_score"]>= MIN_SCORE_TO_ENRICH:
            print(f"finding contact at {job["company"]}")
            contact = await find_contact(job["company"])
            save_contact(job_id, contact)
        print(f"Done. {new_count} new postings has been added")
        return new_count
