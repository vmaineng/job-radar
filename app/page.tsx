"use client";

import { useState, useEffect } from "react";
import { Job } from "./types";
import JobCard from "./components/Jobcard";
import { fetchJobs } from "./api/jobfetch";
import Navbar from "./components/Navbar";

export default function Home() {
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
    loadJobs();
  }, []);

  const markApplied = (id: string) => {
    setJobs((prev) =>
      prev.map((job) => (job.id === id ? { ...job, status: "applied" } : job)),
    );
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="ax-w-6xl mx-auto px-6 pt-28 pb-10">
        <section className="mb-10">
          <h1 className="text-4xl font-bold tracking-tight">Job Radar</h1>

          <p className="text-secondary mt-2">
            AI-ranked opportunities delivered daily.
          </p>
        </section>

        <div
          className="bg-surface
          border
          border-border
          rounded-2xl
          p-6
          shadow-sm"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold">Today's Matches</h2>

              <p className="text-secondary mt-1">
                {loading
                  ? "loading today's matches..."
                  : `${jobs.length} new matches - ranked by fit, with a contact for each other`}
              </p>
            </div>
            {error && (
              <div
                className=" mb-6
              rounded-xl
              border
              border-red-300
              bg-red-50
              p-4
              text-red-700"
              >
                Couldn&aposj;t load jobs: {error}. Is the backend running?
              </div>
            )}

            {!loading && !error && jobs.length === 0 && (
              <div
                className="rounded-xl
              border
              border-border
              p-8
              text-center
              text-secondary"
              >
                No matches yet — check back after the next scheduled run.
              </div>
            )}

            <div className="space-y-4">
              {jobs.map((job) => (
                <JobCard key={job.id} job={job} onMarkApplied={markApplied} />
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
