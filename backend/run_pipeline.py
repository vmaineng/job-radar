import asyncio
from dotenv import load_dotenv
load_dotenv()

from agent.runner import run_job_radar_agent

if __name__ == "__main__":
    result = asyncio.run(run_job_radar_agent())
    print(f"Agent finished — {result['saved_count']} new jobs saved, "
          f"{result['tool_calls']} tool calls, "
          f"${result['estimated_cost_usd']} estimated cost.")