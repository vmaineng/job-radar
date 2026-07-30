import os
import re 
import urllib, parse
import httpx

HUNTER_API_KEY = os.getenv("HUNTER_API_KEY")
HUNTER_DOMAIN_SEARCH_URL = "https://api.hunter.io/v2/domain-search"

PREFERRED_TITLE_KEYWORDS = ["recruit", "talent", "engineering manager", "people", "software engineer"]

def _guess_domain(company_name: str) -> str:
    slug = re.sub(r"[^a-z0-9]", "", company_name.lower())
    return f"{slug}.com"

async def find_contact(company_name: str, company_domain: str | None = None) -> dict:
    domain = company_domain or _guess_domain(company_name)
    if HUNTER_API_KEY:
        try:
            async with httpx.AsyncClient(timeout=20) as client:
                response  = await client.get(
                    HUNTER_DOMAIN_SEARCH_URL,
                    params={"domain": domain, "api_key": HUNTER_API_KEY, "limit": 10},
                )
                if response.status_code == 200:
                    emails = resp.json().get("data", {}).get("emails", [])
                    if emails:
                        best = next(
                            (e for e in emails if e.get("position") and
                             any(kw in e["position"].lower() for kw in PREFERRED_TITLE_KEYWORDS)),
                            emails[0],
                        )
                        full_name = " ".join(
                            filter(None, [best.get("first_name"), best.get("last_name")])
                        ) or None
                        return {
                            "full_name": full_name,
                            "title": best.get("position"),
                            "email": best.get("value"),
                            "source": "hunter",
                        }
        except httpx.HTTPError:
            pass

        query = urllib.parse.quote(f"{company_name} Engineering Manager OR Recruiter")
    return {
        "full_name": None,
        "title": None,
        "email": None,
        "linkedin_search_url": f"https://www.linkedin.com/search/results/people/?keywords={query}",
        "source": "linkedin_search_link",
    }