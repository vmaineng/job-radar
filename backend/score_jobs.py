# import os
# import json
# from anthropic import Anthropic

# client = Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))

# CANDIDATE_PROFILE="""
# Career changer from finance (FP&A) into software engineering, bootcamp grad.
# Stack: React, TypeScript, Next.js, Python, FastAPI, Supabase, Claude API integration.
# Also has a finance/FP&A background (Excel/SQL, budget-vs-actual reporting).
# Targeting junior/entry-level/associate roles in software engineering, business
# analysis, or solutions analysis, in Los Angeles or remote.
# """

# def score_job(title:str, description:str) -> dict:
#     prompt = f"""Candidate profile:
# {CANDIDATE_PROFILE}

# Job posting:
# Title: {title}
# Description: {description[:1500]}

# Return ONLY a JSON object, no other text, with:
# - "score": integer 0-100, how well this posting matches the candidate's level
#   (junior/entry/associate — penalize heavily if it's clearly mid/senior) and stack
# - "reason": one short sentence (under 20 words) on why it does or doesn't fit
# """
#     resp = client.messages.create(
#         model="claude-sonnet-4-6",
#         max_tokens=150,
#         messages=[{"role": "user", "content": prompt}],
#     )
#     text = resp.content[0].text.strip()
#     text = text.replace("```json", "").replace("```", "").strip()
#     try:
#         return json.loads(text)
#     except json.JSONDecodeError:
#         return {"score": 0, "reason": "Could not score this posting."}