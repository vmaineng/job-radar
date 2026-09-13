"use client";

import { useState, useEffect } from "react";
import { useSearchProfile } from "@/hooks/useSearchProfile";

export function SearchProfileForm() {
  const { profile, loading, saving, error, saveProfile } = useSearchProfile();
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [remoteOk, setRemoteOk] = useState(true);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (profile) {
      setTitle(profile.title);
      setLocation(profile.location);
      setRemoteOk(profile.remote_ok);
    }
  }, [profile]);

  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaved(false);
    const ok = await saveProfile({ title, location, remote_ok: remoteOk });
    if (ok) setSaved(true);
  }

  if (loading)
    return <p className="text-sm text-secondary">Loading your search...</p>;

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 bg-card border border-border rounded-2xl p-6"
    >
      <div>
        <label className="block text-sm font-medium mb-1">Job title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Junior Software Engineer"
          maxLength={100}
          required
          className="w-full border border-border rounded-md px-3 py-2 bg-surface text-foreground"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Location</label>
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="e.g. Los Angeles, CA"
          maxLength={100}
          required
          className="w-full border border-border rounded-md px-3 py-2 bg-surface text-foreground"
        />
      </div>
      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={remoteOk}
          onChange={(e) => setRemoteOk(e.target.checked)}
        />
        Include remote postings
      </label>
      {error && <p className="text-sm text-red-600">{error}</p>}
      {saved && !error && (
        <p className="text-sm text-green-600">
          {" "}
          Saved — tomorrow&apos;s run will use this search.
        </p>
      )}

      <button
        type="submit"
        disabled={saving}
        className="w-full rounded-xl bg-primary hover:bg-primary-hover disabled:opacity-60 text-white text-sm font-medium py-2.5 transition-colors"
      >
        {saving ? "Saving..." : "Save Search"}
      </button>
    </form>
  );
}
