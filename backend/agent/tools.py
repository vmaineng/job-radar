from agent.handlers.search_jobs_handler import search_jobs_handler
from agent.handlers.enrich_contact_handler import enrich_contact_handler
from agent.handlers.save_to_dashboard_handler import save_to_dashboard_handler


tools = [
    {
        "name": "search_jobs",
        "description": "Search Adzuna for job postings matching a title and location",
        "input_schema": {
            "type": "object",
            "properties": {},
        },
    },
    {
        "name": "enrich_contact",
        "description": "Look up a hiring contact at a company via Apollo.io. Falls back to a LinkedIn search link if no contact is found.",
        "input_schema": {
            "type": "object",
            "properties": {
                "company_name": {"type": "string"},
                "company_domain": {"type": "string"},
                "relevance_score": {"type": "integer"},
            },
            "required": ["company_name", "relevance_score"],
        },
    },
    {
        "name": "save_to_dashboard",
        "description": "Write a finalized, scored job posting with contact info to the dashboard",
        "input_schema": {
            "type": "object",
            "properties": {
                "job": {
                    "type": "object",
                    "description": "The raw job object exactly as returned by search_jobs — do not modify its fields.",
                },
                "relevance_score": {
                    "type": "integer",
                    "description": "Your fit score, 0-100",
                },
                "relevance_reason": {
                    "type": "string",
                    "description": "One short sentence explaining the score",
                },
                "contact": {
                    "type": ["object", "null"],
                    "description": "Result from enrich_contact, if you called it for this posting. Omit or null otherwise.",
                },
            },
            "required": ["job", "relevance_score", "relevance_reason"],
        },
    },
]


tool_functions = {
    "search_jobs": search_jobs_handler,
    "save_to_dashboard": save_to_dashboard_handler,
    "enrich_contact": enrich_contact_handler,
}