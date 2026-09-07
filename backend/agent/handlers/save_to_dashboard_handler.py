from storage import job_already_seen, save_job, save_contact
import asyncio
import logging

logger = logging.getLogger(__name__)

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
    try:
        source = job["source"]
        external_id = job["external_id"]
    except KeyError as e:
        return {"status": "error", "reason": f"job missing required field: {e}", "job_id": None}


    already_seen = await asyncio.to_thread(job_already_seen, source, external_id)
    if already_seen:
        return {"status": "skipped", "reason": "already seen", "job_id": None}

    
    job = {**job, "relevance_score": relevance_score, "relevance_reason": relevance_reason}

    job_id = save_job(job)
    if job_id is None:
        return {"status": "error", "reason": "failed to save job", "job_id": None}

    if contact is not None:
        save_contact(job_id, contact)

    return {"status": "saved", "job_id": job_id}