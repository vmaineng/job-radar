import { useState, useEffect} from 'react';
import { Job } from '@/types';
import { fetchJobs } from '../api/jobfetch';

export function useJobs() { 
    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function loadJobs() { 
            try { 
                const data = await fetchJobs();
                setJobs(data);
            } catch (err) { 
                setError((err as Error).message);
            } finally { 
                setLoading(false);
            }
        }
        loadJobs()
    }, [])

    const markApplied = (id: string) => { 
        setJobs((prev) => 
        prev.map((job) => (job.id === id ? { ...job, status: "applied"} : job)),
    )
    }

    return {jobs, loading, error, markApplied}
}