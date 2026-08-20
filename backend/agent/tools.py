from agent.handlers.search_jobs_handler import search_jobs_handler
from agent.handlers.enrich_contact_handler import enrich_contact_handler
from agent.handlers.save_to_dashboard_handler import save_to_dashboard_handler

_SEARCH_JOBS_TOOL = {
    "name": "search_jobs",
    "description": "Search for new job postings. Returns only postings not already seen. Takes no arguments — call it once at the start of a run.",
    "input_schema": {"type": "object", "properties": {}},
}

_SAVE_TO_DASHBOARD_TOOL = {
    "name": "save_to_dashboard",
    "description": "Save a scored job posting to the dashboard. Call once per posting from search_jobs. Include contact only for the single posting you ran enrich_contact on.",
    "input_schema": {
        "type": "object",
        "properties": {
            "job": {"type": "object", "description": "The raw job object exactly as returned by search_jobs — do not modify its fields."},
            "relevance_score": {"type": "integer", "description": "Your fit score, 0-100"},
            "relevance_reason": {"type": "string", "description": "One short sentence explaining the score"},
            "contact": {"type": ["object", "null"], "description": "Result from enrich_contact, if you called it for this posting. Omit or null otherwise."},
        },
        "required": ["job", "relevance_score", "relevance_reason"],
    },
}

_ENRICH_CONTACT_TOOL = {
    "name": "enrich_contact",
    "description": "Look up a hiring contact via Hunter.io for a job's company. Can only be called once per run, on your single highest-scoring posting (score >= 50).",
    "input_schema": {
        "type": "object",
        "properties": {
            "company_name": {"type": "string"},
            "company_domain": {"type": "string"},
            "relevance_score": {"type": "integer"},
        },
        "required": ["company_name", "relevance_score"],
    },
}


def build_tools(skip_enrichment: bool = False) -> list[dict]:
    """
    Returns the tool schema list Claude sees. When skip_enrichment is True,
    enrich_contact is omitted entirely — not just discouraged — so Claude
    has no way to call it, protecting the Hunter monthly quota on demo runs.
    """
    tools = [_SEARCH_JOBS_TOOL, _SAVE_TO_DASHBOARD_TOOL]
    if not skip_enrichment:
        tools.append(_ENRICH_CONTACT_TOOL)
    return tools



tool_functions = {
    "search_jobs": search_jobs_handler,
    "save_to_dashboard": save_to_dashboard_handler,
    "enrich_contact": enrich_contact_handler,
}