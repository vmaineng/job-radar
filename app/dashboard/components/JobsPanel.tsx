import JobCard from "@/components/JobCard";
import { Job } from "@/types";

interface JobsPanelProps {
  isGuest: boolean;
  loading: boolean;
  error: string | null;
  jobs: Job[];
  displayJobs: Job[];
  onMarkApplied: (jobId: string) => void;
}

function getMatchesSubtitle(
  isGuest: boolean,
  loading: boolean,
  jobCount: number,
) {
  if (isGuest) return "A preview of what your dashboard will look like.";
  if (loading) return "Loading today's matches...";
  return `${jobCount} new matches — ranked by fit, with a contact for each`;
}

export function JobsPanel({
  isGuest,
  loading,
  error,
  jobs,
  displayJobs,
  onMarkApplied,
}: JobsPanelProps) {
  return (
    <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold">
            {isGuest ? "Sample Matches" : "Today's Matches"}
          </h2>
          <p className="text-secondary mt-1">
            {getMatchesSubtitle(isGuest, loading, jobs.length)}
          </p>
        </div>
      </div>

      {!isGuest && error && (
        <div className="mb-6 rounded-xl border border-red-300 bg-red-50 p-4 text-red-700">
          Couldn&apos;t load jobs: {error}. Is the backend running?
        </div>
      )}

      {!isGuest && !loading && !error && jobs.length === 0 && (
        <div className="rounded-xl border border-border p-8 text-center text-secondary">
          No matches yet — check back after the next scheduled run.
        </div>
      )}

      <div className="space-y-4">
        {displayJobs.map((job) => (
          <JobCard
            key={job.id}
            job={job}
            onMarkApplied={() => onMarkApplied(job.id)}
          />
        ))}
      </div>
    </div>
  );
}
