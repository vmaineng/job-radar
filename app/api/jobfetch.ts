import { Job } from "../types";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000";

export async function fetchJobs(minScore=50): Promise<Job[]> { 
    const res = await fetch(`${API_BASE}/api/jobs??min_score=${minScore}`);
    if (!res.ok) {
        throw new Error(`Failed to load jobs (status ${res.status})`);
    }
    return res.json();
}