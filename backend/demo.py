import asyncio
from fastapi import APIRouter
from pydantic import BaseModel

from demo_fixtures import DEMO_TRACES
from storage import save_demo_run

router = APIRouter(prefix="/api", tags=["demo"])

STEP_DELAY_SECONDS = 0.6

class DemoRunRequest(BaseModel):
    email: str
    preset: str

    @property
    def is_valid_email(self) -> bool:
        return "@" in self.email and "." in self.email.split("@")[-1]


@router.post("/demo-run")
async def demo_run(req: DemoRunRequest):
    if req.preset not in DEMO_TRACES:
        return {"status": "error", "message": "Invalid preset."}

    if not req.is_valid_email:
            return {"status": "error", "message": "Please enter a valid email."} 
    
    fixture = DEMO_TRACES[req.preset]
    # Simulate the agent "thinking" through each trace step in real time,
    # so the demo doesn't just dump the full result instantly.
    for _ in fixture["trace"]:
        await asyncio.sleep(STEP_DELAY_SECONDS)

    try:
        await asyncio.to_thread(save_demo_run, req.email, req.preset)
    except Exception:
         return {"status": "already_used", "message": "This email has already used its demo run."}

    return {
        "status": "success",
        "candidate_profile": fixture["candidate_profile"],
        "saved_count": fixture["saved_count"],
        "trace": fixture["trace"],
         "jobs": fixture.get("jobs", []),
        "is_prerecorded": fixture.get("is_prerecorded", False),
    }