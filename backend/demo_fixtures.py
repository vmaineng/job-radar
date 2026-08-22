DEMO_TRACES = {
    "junior_swe_la": {
        "status": "success",
        "is_prerecorded": True,
        "candidate_profile": "Career changer from finance (FP&A) into software engineering, bootcamp grad. Stack: React, TypeScript, Next.js, Python, FastAPI, Supabase.",
        "saved_count": 4,
        "trace": [
            {
                "type": "reasoning",
                "text": "Starting the run by fetching all new, unseen job postings."
            },
            {
                "type": "tool_call",
                "tool": "search_jobs",
                "input": {}
            },
            {
                "type": "tool_result",
                "tool": "search_jobs",
                "result": {"count": 18}
            },
            {
                "type": "reasoning",
                "text": "Got 18 postings — now I'll score all of them against the candidate profile before deciding on enrichment."
            },
            {
                "type": "tool_call",
                "tool": "save_to_dashboard",
                "input": {
                    "job": "Summer 2027 Software Engineering Internship/Co-op — SpaceX",
                    "relevance_score": 58,
                    "relevance_reason": "Software engineering internship fits candidate level, though internship stage undersells bootcamp experience."
                }
            },
            {
                "type": "tool_result",
                "tool": "save_to_dashboard",
                "result": {"status": "saved"}
            },
            {
                "type": "tool_call",
                "tool": "save_to_dashboard",
                "input": {
                    "job": "Software I&T Engineer, Amazon Leo for Government with Security Clearance — Amazon",
                    "relevance_score": 24,
                    "relevance_reason": "Requires active government security clearance, disqualifying most candidates without prior clearance history."
                }
            },
            {
                "type": "tool_result",
                "tool": "save_to_dashboard",
                "result": {"status": "saved"}
            },
            {
                "type": "tool_call",
                "tool": "save_to_dashboard",
                "input": {
                    "job": "Junior Java Developer / Data Analyst/Scientist — SynergisticIT",
                    "relevance_score": 18,
                    "relevance_reason": "Java/data-science focus and staffing-mill framing don't match candidate's React/TypeScript/Python stack."
                }
            },
            {
                "type": "tool_result",
                "tool": "save_to_dashboard",
                "result": {"status": "saved"}
            },
            {
                "type": "tool_call",
                "tool": "save_to_dashboard",
                "input": {
                    "job": "Business Intelligence Analyst III/IV — UCLA Health",
                    "relevance_score": 46,
                    "relevance_reason": "Finance/analytics background aligns, but BI III/IV seniority and healthcare domain exceed entry level."
                }
            },
            {
                "type": "tool_result",
                "tool": "save_to_dashboard",
                "result": {"status": "saved"}
            },
            {
                "type": "reasoning",
                "text": "All postings scored and saved. The SpaceX internship is the top match at 58 — looking up a contact there."
            },
            {
                "type": "tool_call",
                "tool": "enrich_contact",
                "input": {
                    "job": "Summer 2027 Software Engineering Internship/Co-op — SpaceX"
                }
            },
            {
                "type": "tool_result",
                "tool": "enrich_contact",
                "result": {
                    "source": "hunter",
                    "full_name": "Engineering Recruiter",
                    "title": "Technical Recruiter",
                    "email": "found via Hunter.io"
                }
            }
        ],
        # Full Job-shaped objects for rendering with <JobCard /> once the trace finishes.
        # Field names match the frontend `Job` type used in Dashboard.tsx / JobCard.
        "jobs": [
            {
                "id": "demo-junior_swe_la-1",
                "title": "Summer 2027 Software Engineering Internship/Co-op",
                "company": "SpaceX",
                "location": "Hawthorne, CA",
                "is_remote": False,
                "relevance_score": 58,
                "relevance_reason": "Software engineering internship fits candidate level, though internship stage undersells bootcamp experience.",
                "apply_url": "#",
                "status": "new",
                "contact": {
                    "full_name": "Engineering Recruiter",
                    "title": "Technical Recruiter",
                    "email": None,
                    "linkedin_search_url": "https://www.linkedin.com/search/results/people/?keywords=Technical%20Recruiter%20SpaceX",
                    "source": "hunter",
                },
            },
            {
                "id": "demo-junior_swe_la-2",
                "title": "Software I&T Engineer, Amazon Leo for Government with Security Clearance",
                "company": "Amazon",
                "location": "Los Angeles, CA",
                "is_remote": False,
                "relevance_score": 24,
                "relevance_reason": "Requires active government security clearance, disqualifying most candidates without prior clearance history.",
                "apply_url": "#",
                "status": "new",
                "contact": None,
            },
            {
                "id": "demo-junior_swe_la-3",
                "title": "Junior Java Developer / Data Analyst/Scientist",
                "company": "SynergisticIT",
                "location": "Los Angeles, CA",
                "is_remote": False,
                "relevance_score": 18,
                "relevance_reason": "Java/data-science focus and staffing-mill framing don't match candidate's React/TypeScript/Python stack.",
                "apply_url": "#",
                "status": "new",
                "contact": None,
            },
            {
                "id": "demo-junior_swe_la-4",
                "title": "Business Intelligence Analyst III/IV",
                "company": "UCLA Health",
                "location": "Los Angeles, CA",
                "is_remote": False,
                "relevance_score": 46,
                "relevance_reason": "Finance/analytics background aligns, but BI III/IV seniority and healthcare domain exceed entry level.",
                "apply_url": "#",
                "status": "new",
                "contact": None,
            },
        ],
    },
    "associate_swe_remote": {
        "status": "success",
        "is_prerecorded": True,
        "candidate_profile": "Career changer from finance (FP&A) into software engineering, bootcamp grad. Stack: React, TypeScript, Next.js, Python, FastAPI, Supabase.",
        "saved_count": 0,
        "trace": [
            {
                "type": "reasoning",
                "text": "Fetching new remote-friendly Associate Software Engineer postings."
            },
            {
                "type": "tool_call",
                "tool": "search_jobs",
                "input": {}
            },
            {
                "type": "tool_result",
                "tool": "search_jobs",
                "result": {"count": 0}
            },
            {
                "type": "reasoning",
                "text": "No new postings matched this run — nothing to score or save today."
            }
        ],
        "jobs": [],
    },
    "solutions_analyst": {
        "status": "success",
        "is_prerecorded": True,
        "candidate_profile": "Career changer from finance (FP&A) into software engineering, bootcamp grad. Stack: React, TypeScript, Next.js, Python, FastAPI, Supabase.",
        "saved_count": 0,
        "trace": [
            {
                "type": "reasoning",
                "text": "Fetching new Solutions Analyst I postings in Los Angeles."
            },
            {
                "type": "tool_call",
                "tool": "search_jobs",
                "input": {}
            },
            {
                "type": "tool_result",
                "tool": "search_jobs",
                "result": {"count": 0}
            },
            {
                "type": "reasoning",
                "text": "No new postings matched this run — nothing to score or save today."
            }
        ],
        "jobs": [],
    },
}