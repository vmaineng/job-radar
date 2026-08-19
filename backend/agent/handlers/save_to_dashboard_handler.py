from storage import job_already_seen, save_job, save_contact

async def save_to_dashboard_handler(
    job: dict,
    relevance_score: int,
    relevance_reason: str,
    contact: dict | None = None,
) -> dict:
    """
    Tool handler for `save_to_dashboard`. Attaches Claude's score/reason
    to the raw job dict from search_jobs, writes it, and optionally
    attaches a contact (only present when this was the enriched top pick).
    """
    if job_already_seen(job["source"], job["external_id"]):
        return {"status": "skipped", "reason": "already seen"}

    job["relevance_score"] = relevance_score
    job["relevance_reason"] = relevance_reason

    job_id = save_job(job)

    if contact:
        save_contact(job_id, contact)

    return {"status": "saved", "job_id": job_id}