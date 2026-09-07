# agent/handlers/enrich_contact.py
from datetime import datetime, timezone
from enrich_contacts import find_contact
from storage import supabase
import logging

logger = logging.getLogger(__name__)

MONTHLY_HUNTER_LIMIT = 20
MIN_SCORE_TO_ENRICH = 50
MAX_ENRICH_CALLS_PER_RUN = 1


def _linkedin_fallback_url(company_name: str) -> str:
    import urllib.parse

    query = urllib.parse.quote(f"{company_name} Engineering Manager OR Recruiter")
    return f"https://www.linkedin.com/search/results/people/?keywords={query}"


def _get_hunter_calls_this_month() -> int:
    try:
        start_of_month = datetime.now(timezone.utc).date().replace(day=1).isoformat()
        res = (
            supabase.table("hunter_usage")
            .select("id")
            .gte("called_at", start_of_month)
            .execute()
        )
        return len(res.data)
    except Exception as e:
        logger.error(f"failed to check hunter usage: {e}")
        return MONTHLY_HUNTER_LIMIT


def _increment_hunter_usage() -> None:
    try:
        supabase.table("hunter_usage").insert({}).execute()
    except Exception as e:
        logger.error(f"failed to record Hunter usage: {e}")

def _no_contact(company_name:str, reason: str) -> dict:
    return { 
        "full_name": None,
        "title": None,
        "email": None,
        "linkedin_search_url": _linkedin_fallback_url(company_name),
        "source":reason,
    }


async def enrich_contact_handler(
    company_name: str,
    relevance_score: int,
    company_domain: str | None = None,
    calls_this_run: int = 0,
) -> dict:
    """
    Tool handler for `enrich_contact`. Enforces three hard backstops so a
    prompt-following slip can never cost a Hunter credit on a low-fit
    posting or exceed the monthly quota:
      1. calls_this_run must be under MAX_ENRICH_CALLS_PER_RUN
      2. relevance_score must be >= MIN_SCORE_TO_ENRICH
      3. Hunter calls this month must be under MONTHLY_HUNTER_LIMIT
    """

    if calls_this_run >= MAX_ENRICH_CALLS_PER_RUN:
        return _no_contact(company_name, "run_limit_reached")
    if relevance_score < MIN_SCORE_TO_ENRICH:
        return _no_contact(company_name, "score_too_low")

    calls_this_month = _get_hunter_calls_this_month()
    if calls_this_month >= MONTHLY_HUNTER_LIMIT:
        return _no_contact(company_name, "budget_exceeded")

    result = await find_contact(company_name, company_domain)
    if result.get("source") == "hunter":
        _increment_hunter_usage()
    return result
