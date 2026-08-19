


tools = [
    {
        "name": "search_jobs",
        "description": "Search Adzuna for job postings matching a title and location",
        "input_schema": {
            "type": "object",
            "properties": {},
           
        }
    },
    {
        "name": "enrich_contact",
        "description": "Look up a hiring contact at a company via Apollo.io. Falls back to a LinkedIn search link if no contact is found.",
        "input_schema": {
            "type": "object",
               "properties": {
            "company_name": {"type": "string"},
            "company_domain": {"type": "string", "description": "Optional — if known"},
            "relevance_score": {"type": "integer", "description": "The score you assigned this posting"},
        },
        "required": ["company_name", "relevance_score"]
        }
    },
    {
        "name": "save_to_dashboard",
        "description": "Write a finalized, scored job posting with contact info to the dashboard",
        "input_schema": {
            "type": "object",
            "properties": {
                "job_id": {"type": "string"},
                "fit_score": {"type": "number"},
                "reasoning": {"type": "string"},
                "contact": {"type": "object"}
            },
            "required": ["job_id", "fit_score"]
        }
    }
]