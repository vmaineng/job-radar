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
    <div>
      <Navbar />
      <div className="max-w-4xl mx-auto p-6">
        <p className="text-gray-500 mb-6">
          {loading
            ? "loading today's matches..."
            : `${jobs.length} new matches - ranked by fit, with a contact for each other`}
        </p>
        {error && (
          <div className="border border-red-200 bg-red-50 bg-red-50 text-red-700 rounded-xl p-4 mb-4">
            Couldn&aposj;t load jobs: {error}. Is the backend running?
          </div>
        )}

        {!loading && !error && jobs.length === 0 && (
          <div className="text-gray-500 border rounded-xl p-6 text-center">
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
  );
}
