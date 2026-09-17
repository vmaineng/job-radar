import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabaseClient";

export type UserSettings = {
  has_api_key: boolean;
  updated_at: string | null;
};

export function useUserSettings() {
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const { data: { session } } = await supabase.auth.getSession();
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user-settings`, {
          headers: { Authorization: `Bearer ${session?.access_token}` },
        });
        if (!res.ok) throw new Error("Failed to load settings");
        const data = await res.json();
        if (!ignore) setSettings(data);
      } catch {
        if (!ignore) setError("Couldn't load your settings.");
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    load();
    return () => { ignore = true; };
  }, []);

  const saveApiKey = useCallback(async (anthropicApiKey: string) => {
    setSaving(true);
    setError(null);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user-settings`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.access_token}`,
        },
        body: JSON.stringify({ anthropic_api_key: anthropicApiKey }),
      });
      if (!res.ok) throw new Error("Failed to save API key");
      const data = await res.json();
      setSettings(data);
      return true;
    } catch {
      setError("Couldn't save your API key — please try again.");
      return false;
    } finally {
      setSaving(false);
    }
  }, []);

  return { settings, loading, saving, error, saveApiKey };
}