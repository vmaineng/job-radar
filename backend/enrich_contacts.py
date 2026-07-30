import os
import re 
import urllib, parse
import httpx
from anthropic import Anthropic

HUNTER_API_KEY = os.getenv("HUNTER_API_KEY")
HUNTER_DOMAIN_SEARCH_URL = "https://api.hunter.io/v2/domain-search"

anthropic_client = Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))

PREFERRED_TITLE_KEYWORDS = ["recruit", "talent", "engineering manager", "people", "software engineer"]

def _naive_guess_domain(company_name: str) -> str:
    slug = re.sub(r"[^a-z0-9]", "", company_name.lower())
    return f"{slug}.com"

def _claude_guess_domain(company_name: str) -> str | None:
    """Ask Claude for the company's real primary domain. Returns None if
    Claude doesn't recognize the company or isn't confident -- callers
    should fall back to _naive_guess_domain in that case."""
    prompt = f"""What is the primary website domain for this company: "{company_name}"?
 
Return ONLY a JSON object, no other text:
- If you know the domain with reasonable confidence: {{"domain": "example.com"}}
- If you don't recognize this company or aren't confident: {{"domain": null}}
 
Use the company's main corporate domain (e.g. for a games studio owned by a
larger company, prefer the studio's own domain if well-known, otherwise the
parent company's domain)."""
    try:
        resp = anthropic_client.messages.create(
            model="claude-sonnet-4-6",
            max_tokens=50,
            messages=[{"role": "user", "content": prompt}],
        )
        text = resp.content[0].text.strip().replace("```json", "").replace("```", "").strip()
        data = json.loads(text)
        domain = data.get("domain")
        return domain if domain else None
    except Exception:
        return None  # any failure here just means "didn't know" -- never block the pipeline

def _resolve_domain(company_name:str, company_domain:str | None) -> str:
    if company_domain:
        return company_domain
    claude_guess = _claude_guess_domain(company_name)
    if claude_guess:
        return claude_guess
    return _naive_guess_domain(company_name)

async def find_contact(company_name: str, company_domain: str | None = None) -> dict:
    domain = _resolve_domain(company_name, company_domain)
    
    if HUNTER_API_KEY:
        try:
            async with httpx.AsyncClient(timeout=20) as client:
                response  = await client.get(
                    HUNTER_DOMAIN_SEARCH_URL,
                    params={"domain": domain, "api_key": HUNTER_API_KEY, "limit": 10},
                )
                if response.status_code == 200:
                    emails = response.json().get("data", {}).get("emails", [])
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