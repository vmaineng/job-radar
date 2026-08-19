# agent/handlers/enrich_contact.py
from datetime import date
from enrich_contacts import find_contact
from storage import supabase 

MONTHLY_HUNTER_LIMIT = 20
MIN_SCORE_TO_ENRICH = 50
MAX_ENRICH_CALLS_PER_RUN = 1

def _linkedin_fallback_url(company_name: str) -> str:
    import urllib.parse
    query = urllib.parse.quote(f"{company_name} Engineering Manager OR Recruiter")
    return f"https://www.linkedin.com/search/results/people/?keywords={query}"

def _get_hunter_calls_this_month() -> int:
    start_of_month = date.today().replace(day=1).isoformat()
    res = (
        supabase.table("hunter_usage")
        .select("id")
        .gte("called_at", start_of_month)
        .execute()
    )
    return len(res.data)

def _increment_hunter_usage():
    supabase.table("hunter_usage").insert({}).execute()

async def enrich_contact_handler(company_name: str, relevance_score: int, company_domain: str | None = None, calls_this_run: int = 0,) -> dict:
    """
    Tool handler for `enrich_contact`. Enforces two hard backstops so a
    prompt-following slip can never cost a Hunter credit on a low-fit
    posting or exceed the monthly quota:
      1. relevance_score must be >= MIN_SCORE_TO_ENRICH
      2. Hunter calls this month must be under MONTHLY_HUNTER_LIMIT
      3. Hunter calls this month must be under MONTHLY_HUNTER_LIMIT
    """

    if calls_this_run >= MAX_ENRICH_CALLS_PER_RUN:
        return {
            "full_name": None,
            "title": None,
            "email": None,
            "linkedin_search_url": _linkedin_fallback_url(company_name),
            "source": "run_limit_reached",
        }
    if relevance_score < MIN_SCORE_TO_ENRICH:
        return {
            "full_name": None,
            "title": None,
            "email": None,
            "linkedin_search_url": _linkedin_fallback_url(company_name),
            "source": "score_too_low",
        }

    calls_this_month = _get_hunter_calls_this_month()
    if calls_this_month >= MONTHLY_HUNTER_LIMIT:
        return {
            "full_name": None,
            "title": None,
            "email": None,
            "linkedin_search_url": _linkedin_fallback_url(company_name),
            "source": "budget_exceeded",
        }

    result = await find_contact(company_name, company_domain)
    if result.get("source") == "hunter":
        _increment_hunter_usage()
    return result