import { useState, useRef, useCallback} from "react";

interface UseDemoRunResult<T> { 
    loading: boolean;
    result: T | null;
    error: string | null;
    run: (body: Record<string, unknown> ) => Promise<void>; 
}

export function useDemoRun<T extends { status?: string; message?: string }>(
  endpoint: string
): UseDemoRunResult<T> {

      const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const run = useCallback(
    async (body: Record<string, unknown>) => {
        abortRef.current?.abort();
        const controller = new AbortController();
        abortRef.current = controller;

        setLoading(true);
    setError(null);
    setResult(null);

try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}${endpoint}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
          signal: controller.signal,
        },
      );

      if (!res.ok) {
        setError("Something went wrong on our end — please try again.");
        return;
      }

      const data: T = await res.json();

      if (data.status === "already_used") {
        setError(
          "This email has already used its demo run — thanks for checking it out!",
        );
      } else if (data.status === "error") {
        setError(data.message ?? "Something went wrong.");
      } else {
        setResult(data);
      }
    } catch (err) {
       if ((err as Error).name !== "AbortError") {
          setError("Couldn't reach the agent — please try again in a moment.");}
    } finally {
      setLoading(false);
    }
  },
[endpoint]);

   
  return { loading, result, error, run };
   }