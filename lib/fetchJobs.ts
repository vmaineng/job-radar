import { Job } from "@/types";
import { supabase } from "@/lib/supabaseClient";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export async function fetchJobs(minScore=50, todayOnly = true): Promise<Job[]> {
    const {
        data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
        throw new Error("Not authenticated");
    }

    const params = new URLSearchParams({
        min_score: String(minScore),
        today_only: String(todayOnly)
    })
    
    const res = await fetch(`${API_BASE}/api/jobs?${params.toString()}`,{  headers: {
            Authorization: `Bearer ${session.access_token}`,
        },});
    if (!res.ok) {
        throw new Error(`Failed to load jobs (status ${res.status})`);
    }
    return res.json();
}