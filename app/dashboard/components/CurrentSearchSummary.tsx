"use client";

import Link from "next/link";
import { useSearchProfile } from "@/hooks/useSearchProfile";

export function CurrentSearchSummary() {
  const { profile, loading, error } = useSearchProfile();
  if (loading) {
    return (
      <div className="bg-card border border-border rounded-2xl p-6">
        <p className="text-sm text-secondary">Loading your search...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-card border border-border rounded-2xl p-6">
        <p className="text-sm text-red-600">{error}</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="bg-card border border-border rounded-2xl p-6">
        <p className="text-sm text-secondary mb-3">
          You haven&apos;t set up a search yet.
        </p>
        <Link
          href="/dashboard/settings"
          className="text-sm font-medium text-primary hover:underline"
        >
          Set up your search →
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-2xl p-6">
      <p className="text-xs uppercase tracking-wide text-secondary mb-2">
        Your search
      </p>
      <p className="text-lg font-semibold text-foreground">{profile.title}</p>
      <p className="text-sm text-secondary mb-3">
        {profile.location}
        {profile.remote_ok ? " · Remote OK" : ""}
      </p>
      <Link
        href="/dashboard/settings"
        className="text-sm font-medium text-primary hover:underline"
      >
        Edit search →
      </Link>
    </div>
  );
}
