"use client";

import { useState } from "react";
import { useUserSettings } from "@/hooks/useUserSettings";
import Link from "next/link";

export function ApiKeyForm() {
  const { settings, loading, saving, error, saveApiKey } = useUserSettings();

  if (loading) {
    return <p className="text-sm text-secondary">Loading your settings...</p>;
  }
  return (
    <ApiKeyFormInner
      settings={settings}
      saving={saving}
      error={error}
      saveApiKey={saveApiKey}
    />
  );
}

function ApiKeyFormInner({
  settings,
  saving,
  error,
  saveApiKey,
}: {
  settings: { has_api_key: boolean; updated_at: string | null } | null;
  saving: boolean;
  error: string | null;
  saveApiKey: (key: string) => Promise<boolean>;
}) {
  const [apiKey, setApiKey] = useState("");
  const [saved, setSaved] = useState(false);

  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaved(false);
    const ok = await saveApiKey(apiKey);
    if (ok) {
      setSaved(true);
      setApiKey("");
    }
  }
  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 bg-card border border-border rounded-2xl p-6"
    >
      <div>
        <label className="block text-sm font-medium mb-1">
          Anthropic API key
        </label>
        <p className="text-xs text-secondary mb-2">
          {settings?.has_api_key
            ? "A key is currently saved. Enter a new one below to replace it."
            : "Job Radar uses your own Anthropic API key to run searches — this keeps your usage and billing separate from other users."}
        </p>
        <input
          type="password"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          placeholder="sk-ant-..."
          required
          className="w-full border border-border rounded-md px-3 py-2 bg-surface text-foreground"
        />
        <p className="text-xs text-secondary mt-1">
          Get a key at{" "}
          <Link
            href="https://console.anthropic.com/settings/keys"
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            console.anthropic.com
          </Link>
        </p>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}
      {saved && !error && (
        <p className="text-sm text-green-600">API key saved.</p>
      )}

      <button
        type="submit"
        disabled={saving}
        className="w-full rounded-xl bg-primary hover:bg-primary-hover disabled:opacity-60 text-white text-sm font-medium py-2.5 transition-colors"
      >
        {saving ? "Saving..." : "Save API Key"}
      </button>
    </form>
  );
}
