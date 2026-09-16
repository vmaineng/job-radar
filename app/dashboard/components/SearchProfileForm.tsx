"use client";

import { useState } from "react";
import { useSearchProfile, SearchProfile } from "@/hooks/useSearchProfile";

export function SearchProfileForm() {
  const { profile, loading, saving, error, saveProfile } = useSearchProfile();

  if (loading)
    return <p className="text-sm text-secondary">Loading your search...</p>;

  return (
    <SearchProfileFormInner
      profile={profile}
      saving={saving}
      error={error}
      saveProfile={saveProfile}
    />
  );
}

function SearchProfileFormInner({
  profile,
  saving,
  error,
  saveProfile,
}: {
  profile: SearchProfile | null;
  saving: boolean;
  error: string | null;
  saveProfile: (next: SearchProfile) => Promise<boolean>;
}) {
  const [title, setTitle] = useState(profile?.title ?? "");
  const [location, setLocation] = useState(profile?.location ?? "");
  const [remoteOk, setRemoteOk] = useState(profile?.remote_ok ?? true);
  const [background, setBackground] = useState(profile?.background ?? "");
  const [saved, setSaved] = useState(false);

  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaved(false);
    const ok = await saveProfile({
      title,
      location,
      remote_ok: remoteOk,
      background,
    });
    if (ok) setSaved(true);
  }

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
      <div>
        <label className="block text-sm font-medium mb-1">
          Background (optional)
        </label>
        <textarea
          value={background}
          onChange={(e) => setBackground(e.target.value)}
          placeholder="e.g. Bootcamp grad transitioning from finance, skilled in React and Python..."
          maxLength={1000}
          rows={3}
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
