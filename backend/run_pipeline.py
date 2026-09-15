import asyncio

from dotenv import load_dotenv

load_dotenv()

from agent.runner import run_job_radar_agent
from pipeline_logic import get_all_search_profiles, has_run_today, log_run

async def run_for_profile(profile: dict):
    user_id = profile["user_id"]

    if has_run_today(user_id):
        print(f"Skipping user {user_id} — already ran today.")
        return

    try:
        result = await run_job_radar_agent(
            search_titles=[profile["title"]],
            search_location=profile["location"],
            include_remote=profile["remote_ok"],
            user_id=user_id,
        )
        log_run(user_id, result)
        print(
         f"User {user_id}: {result['saved_count']} new jobs saved, "
            f"{result['tool_calls']} tool calls, "
            f"${result['estimated_cost_usd']} estimated cost."   
        )
    except Exception as e:
        print("User was not found")

async def main():
    profiles = get_all_search_profiles()
    if not profiles:
        print("No search profiles found — nothing to run.")
        return

    for profile in profiles:
        await run_for_profile(profile)


if __name__ == "__main__":
    asyncio.run(main())