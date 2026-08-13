"use client";

import JobCard from "@/components/Jobcard";
import DashboardNavbar from "./DashboardNavbar";
import { useJobs } from "../../hooks/useJobs";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Job } from "@/types";

const SAMPLE_JOBS: Job[] = [
  {
    id: "sample-1",
    title: "Junior Frontend Engineer",
    company: "Acme Robotics",
    location: "Los Angeles, CA",
    is_remote: false,
    relevance_score: 92,
    relevance_reason:
      "Strong match on React + TypeScript experience and your recent bootcamp projects.",
    apply_url: "#",
    status: "new",
    contacts: [
      {
        full_name: "Jordan Reyes",
        title: "Engineering Manager",
        email: null,
        linkedin_search_url:
          "https://www.linkedin.com/search/results/people/?keywords=Jordan%20Reyes%20Acme%20Robotics",
        source: "sample",
      },
    ],
  },
  {
    id: "sample-2",
    title: "Associate Software Engineer",
    company: "Northwind Labs",
    location: "Remote",
    is_remote: true,
    relevance_score: 87,
    relevance_reason:
      "Entry-level title match with FastAPI backend work aligning to your recent projects.",
    apply_url: "#",
    status: "new",
    contacts: [
      {
        full_name: "Test2",
        title: "CTO",
        email: "test@gmail.com",
        linkedin_search_url: "test@linkedin.com",
        source: "LinkedIn",
      },
    ],
  },
];

export default function Dashboard() {
  const { jobs, loading, error, markApplied } = useJobs();
  const { user, loading: authLoading, signOut } = useAuth();
  const router = useRouter();

  async function handleLogout() {
    await signOut();
    router.push("/login");
  }

  const isGuest = !authLoading && !user;
  const displayJobs = isGuest ? SAMPLE_JOBS : jobs;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <DashboardNavbar onLogout={handleLogout} />
      <main className="max-w-6xl mx-auto px-6 pt-28 pb-10">
        {isGuest && (
          <div className="mb-6 rounded-2xl border border-primary/30 bg-primary/10 p-4 flex items-center justify-between">
            <p className="text-sm text-foreground">
              You&apos;re viewing sample matches. Sign up to get real
              daily-scanned jobs with contacts.
            </p>
            <div className="flex gap-3 shrink-0 ml-4">
              <Link
                href="/login"
                className="text-sm font-medium text-primary hover:underline"
              >
                Log in
              </Link>
              <Link
                href="/signup"
                className="text-sm font-medium bg-primary text-white px-3 py-1.5 rounded-lg hover:bg-primary-hover"
              >
                Sign up
              </Link>
            </div>
          </div>
        )}

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
              <h2 className="text-xl font-semibold">
                {isGuest ? "Sample Matches" : "Today's Matches"}
              </h2>

              <p className="text-secondary mt-1">
                {isGuest
                  ? "A preview of what your dashboard will look like."
                  : loading
                    ? "loading today's matches..."
                    : `${jobs.length} new matches - ranked by fit, with a contact for each`}
              </p>
            </div>
          </div>
          {!isGuest && error && (
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
                onMarkApplied={
                  isGuest ? () => router.push("/signup") : markApplied
                }
              />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
