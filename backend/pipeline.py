# import os
# from scores_adzuna import run_search_profile
# from score_jobs import score_job
# from enrich_contacts import find_contact
# from storage import job_already_seen, save_job, save_contact

# SEARCH_TITLES = [t.strip() for t in os.getenv("SEARCH_TITLES", "").split(',') if t.strip()]
# SEARCH_LOCATION = os.getenv("SEARCH_LOCATION", "Los Angeles")
# INCLUDE_REMOTE = os.getenv("INCLUDE_REMOTE", "true").lower() == 'true'
# MIN_SCORE_TO_ENRICH = 50 
# MAX_CONTACTS_PER_RUN = 1

# async def run_pipeline():
#     print("searching for new postings..")
#     raw_jobs = await run_search_profile(SEARCH_TITLES, SEARCH_LOCATION, INCLUDE_REMOTE)
#     print(f"found {len(raw_jobs)} raw results")

#     saved_today = []

#     for job in raw_jobs:
#         if job_already_seen(job["source"], job["external_id"]):
#             continue
#         print(f"scoring {job["title"]} at {job["company"]}...")
#         scored = score_job(job["title"], job["description"])
#         job["relevance_score"] = scored.get("score", 0)
#         job["relevance_reason"] = scored.get('reason', "")

#         job_id = save_job(job)
#         saved_today.append((job_id, job))
#     new_count = len(saved_today)

#     eligible = [
#         (job_id, job) for job_id, job in saved_today
#         if job["relevance_score"] >= MIN_SCORE_TO_ENRICH
#     ]

#     if eligible:
#         top_job_id, top_job = max(eligible, key=lambda pair: pair[1]["relevance_score"])
#         print(
#             f"📇 Step 3: enriching today's top match — "
#             f"'{top_job['title']}' at {top_job['company']} "
#             f"(score {top_job['relevance_score']})..."
#         )
#         contact = await find_contact(top_job["company"])
#         save_contact(top_job_id, contact)
#     else:
#         print("📇 Step 3: no job scored high enough to spend today's contact credit.")
 
#     print(f"✅ Done. {new_count} new postings added to the dashboard.")
#     return new_count
