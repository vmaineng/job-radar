"use client";

import DashboardNavbar from "./components/DashboardNavbar";
import { GuestBanner } from "./components/GuestBanner";
import { JobsPanel } from "./components/JobsPanel";
import { useJobs } from "../../hooks/useJobs";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { SAMPLE_JOBS } from "@/lib/samepleJobs";

export default function Dashboard() {
  const { jobs, loading, error, markApplied } = useJobs();
  const { user, loading: authLoading, signOut } = useAuth();
  const router = useRouter();

  async function handleLogout() {
    await signOut();
    router.push("/login");
  }

  if (authLoading) {
    return null;
  }

  const isGuest = !user;
  const displayJobs = isGuest ? SAMPLE_JOBS : jobs;
  const handleMarkApplied = isGuest
    ? () => router.push("/signup")
    : markApplied;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <DashboardNavbar isGuest={isGuest} onLogout={handleLogout} />
      <main className="max-w-6xl mx-auto px-6 pt-28 pb-10">
        {isGuest && <GuestBanner />}
        <JobsPanel
          isGuest={isGuest}
          loading={loading}
          error={error}
          jobs={jobs}
          displayJobs={displayJobs}
          onMarkApplied={handleMarkApplied}
        />
      </main>
    </div>
  );
}
