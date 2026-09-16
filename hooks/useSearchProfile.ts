import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabaseClient";

export type SearchProfile = {
  title: string;
  location: string;
  remote_ok: boolean;
  background: string;
};

export function useSearchProfile() {
  const [profile, setProfile] = useState<SearchProfile | null>(null);
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
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/search-profile`, {
          headers: { Authorization: `Bearer ${session?.access_token}` },
        });
        if (!res.ok) throw new Error("Failed to load search profile");
        const data = await res.json();
        if (!ignore) setProfile(data);
      } catch {
        if (!ignore) setError("Couldn't load your search profile.");
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    load();

    return () => {
      ignore = true;
    };
  }, []);

   const saveProfile = useCallback(async (next: SearchProfile) => {
    setSaving(true);
    setError(null);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/search-profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.access_token}`,
        },
        body: JSON.stringify(next),
      });
      if (!res.ok) throw new Error("Failed to save search profile");
      const data = await res.json();
      setProfile(data);
      return true;
    } catch {
      setError("Couldn't save your search — please try again.");
      return false;
    } finally {
      setSaving(false);
    }
  }, []);

  return { profile, loading, saving, error, saveProfile };

}
