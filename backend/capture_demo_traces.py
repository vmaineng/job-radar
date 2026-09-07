
from dotenv import load_dotenv
load_dotenv()

import asyncio, json
from agent.runner import run_job_radar_agent

PRESETS = [
    ("junior_swe_la", ["Software Engineer I", "Junior Software Engineer"], "Los Angeles"),
]

async def capture_all():
    for preset_key, search_titles, search_location in PRESETS:
        await capture(preset_key, search_titles, search_location)

async def capture(preset_key, search_titles, search_location):
    try:
        result = await run_job_radar_agent(
        search_titles=search_titles,
        search_location=search_location,
        include_remote=True,
        skip_enrichment=False, 
        demo_mode=True,
    )
    except Exception as e:
        print(f"Failed capturing {preset_key}: {e}")
        return
    
    with open(f"demo_trace_{preset_key}.json", "w") as f:
        json.dump(result, f, indent=2)
    print(f"Saved {preset_key}: {result['saved_count']} saved, {result['tool_calls']} tool calls, ${result['estimated_cost_usd']}")

if __name__ == "__main__":
    asyncio.run(capture_all())