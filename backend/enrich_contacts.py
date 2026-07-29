import osimport 
import urllib, parse
import httpx

APOLLO_API_KEY = os.getenv("APOLLO_API_KEY")
APOLLO_SEARCH_URL = "https://api.apollo/io/v1/mixed_people/search"

TARGET_TITLES=["Recruiter", "Technical Recruiter", "Engineering Manager", "Engineer"]

async def find_contact(company_name: str) -> dict:
    if APOLLO_API_KEY:
        try:
            async with httpx.AsyncClient(timeout=20) as client:
                response = await client.post(
                    APOLLO_SEARCH_URL,
                    headers = {"Content-Type": "application/json",
                               "X-Api-Key": APOLLO_API_KEY},
                    json={ 
                        "q_organization_name": company_name,
                        "person_titles": TARGET_TITLES,
                        "page": 1,
                        "per_page": 1, 
                    },
                )
                if response.status == 200:
                    people = response.json().get("people", [])
                    if people:
                        p = people[0]
                        return { 
                             "full_name": p.get("name"),
                            "title": p.get("title"),
                            "email": p.get("email"),
                            "source": "apollo",
                        }
        except httpx.HTTPError:
            pass