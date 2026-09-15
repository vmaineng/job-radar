from datetime import datetime, timezone
from storage import supabase

def has_run_today(user_id: str) -> bool:
    today = datetime.now(timezone.utc).date().isoformat()
    res = (
        supabase.table("agent_runs")
        .select("id")
        .eq("user_id", user_id)
        .gte("ran_at", f"{today}T00:00:00")
        .execute()
    )
    return len(res.data) > 0

def log_run(user_id: str, result: dict):
    supabase.table("agent_runs").insert({
        "user_id": user_id,
        "ran_at": datetime.now(timezone.utc).isoformat(),
        **result,
    }).execute()

def get_search_profile(user_id: str) -> dict | None:
    res = (
        supabase.table("search_profiles")
        .select("*")
        .eq("user_id", user_id)
        .maybe_single()
        .execute()
    )
    if res is None:
        return None
    return res.data

def get_all_search_profiles() -> list[dict]:
    res = supabase.table("search_profiles").select("*").execute()
    return res.data or []