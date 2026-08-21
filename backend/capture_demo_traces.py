# capture_demo_traces.py
from dotenv import load_dotenv
load_dotenv()

import asyncio, json
from agent.runner import run_job_radar_agent

async def capture(preset_key, search_titles, search_location):
    result = await run_job_radar_agent(
        search_titles=search_titles,
        search_location=search_location,
        demo_mode=True,
    )
    with open(f"demo_trace_{preset_key}.json", "w") as f:
        json.dump(result, f, indent=2)
    print(f"Saved {preset_key}: {result['saved_count']} saved, {result['tool_calls']} tool calls, ${result['estimated_cost_usd']}")

if __name__ == "__main__":
    asyncio.run(capture("junior_swe_la", ["Software Engineer I", "Junior Software Engineer"], "Los Angeles"))