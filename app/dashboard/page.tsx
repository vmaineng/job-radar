"use client";

import JobCard from "@/components/Jobcard";
import DashboardNavbar from "./DashboardNavbar";
import { useJobs } from "../../hooks/useJobs";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const { jobs, loading, error, markApplied } = useJobs();
  const { signOut } = useAuth();
  const router = useRouter();

  async function handleLogout() {
    await signOut();
    router.push("/login");
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <DashboardNavbar onLogout={handleLogout} />
      <main className="ax-w-6xl mx-auto px-6 pt-28 pb-10">
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
