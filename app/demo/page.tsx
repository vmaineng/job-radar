"use client";

import { useState } from "react";
import { renderResultSummary } from "@/lib/formatTraceResult";

type TraceStep =
  | { type: "reasoning"; text: string }
  | { type: "tool_call"; tool: string; input: Record<string, unknown> }
  | { type: "tool_result"; tool: string; result: Record<string, unknown> }
  | { type: "system"; text: string };

type DemoResult = {
  status: string;
  message?: string;
  candidate_profile?: string;
  saved_count?: number;
  trace?: TraceStep[];
};

const PRESETS = [
  { key: "junior_swe_la", label: "Junior Software Engineer — Los Angeles" },
  {
    key: "associate_swe_remote",
    label: "Associate Software Engineer — Remote",
  },
  { key: "solutions_analyst", label: "Solutions Analyst I — Los Angeles" },
];

const TOOL_LABELS: Record<string, string> = {
  search_jobs: "🔍 Searching for postings",
  save_to_dashboard: "💾 Saving scored posting",
  enrich_contact: "📇 Looking up a contact",
};

export default function DemoPage() {
  const [email, setEmail] = useState("");
  const [preset, setPreset] = useState(PRESETS[0].key);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<DemoResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function runDemo() {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/demo-run`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, preset }),
        },
      );
      const data: DemoResult = await res.json();

      if (data.status === "already_used") {
        setError(
          "This email has already used its demo run — thanks for checking it out!",
        );
      } else if (data.status === "error") {
        setError(data.message ?? "Something went wrong.");
      } else {
        setResult(data);
      }
    } catch {
      setError("Couldn't reach the agent — please try again in a moment.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-semibold mb-2">
        Watch the Job Radar agent work
      </h1>
      <p className="text-gray-600 mb-8">
        Job Radar is an AI agent that searches, scores, and enriches job
        postings on its own — pick a search below and watch it reason through
        each step.
      </p>

      {!result && (
        <div className="space-y-4 border rounded-lg p-6 bg-white shadow-sm">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full border rounded-md px-3 py-2"
              disabled={loading}
            />
            <p className="text-xs text-gray-500 mt-1">
              One demo run per email — no spam, promise.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Search</label>
            <select
              value={preset}
              onChange={(e) => setPreset(e.target.value)}
              className="w-full border rounded-md px-3 py-2"
              disabled={loading}
            >
              {PRESETS.map((p) => (
                <option key={p.key} value={p.key}>
                  {p.label}
                </option>
              ))}
            </select>
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            onClick={runDemo}
            disabled={loading || !email}
            className="w-full bg-black text-white rounded-md py-2 font-medium disabled:opacity-50"
          >
            {loading ? "Running agent..." : "Run Agent"}
          </button>
        </div>
      )}

      {result && (
        <div className="space-y-6">
          {result.candidate_profile && (
            <div className="text-sm bg-gray-50 border rounded-lg p-4 text-gray-700">
              <span className="font-medium">Scoring against:</span>{" "}
              {result.candidate_profile}
            </div>
          )}

          <div className="space-y-3">
            {result.trace?.map((step, i) => (
              <TraceItem key={i} step={step} />
            ))}
          </div>

          <div className="text-sm text-gray-500 pt-4 border-t">
            {result.saved_count} posting{result.saved_count === 1 ? "" : "s"}{" "}
            evaluated and saved.
          </div>
        </div>
      )}
    </div>
  );
}

function TraceItem({ step }: { step: TraceStep }) {
  if (step.type === "reasoning") {
    return (
      <p className="text-gray-800 italic pl-2 border-l-2 border-gray-200">
        {step.text}
      </p>
    );
  }
  if (step.type === "tool_call") {
    return (
      <div className="bg-blue-50 border border-blue-100 rounded-md px-3 py-2 text-sm">
        <span className="font-medium">
          {TOOL_LABELS[step.tool] ?? step.tool}
        </span>
      </div>
    );
  }
  if (step.type === "tool_result") {
    return (
      <div className="bg-gray-50 border rounded-md px-3 py-2 text-sm text-gray-600">
        {renderResultSummary(step)}
      </div>
    );
  }
  return <p className="text-xs text-gray-400">{step.text}</p>;
}
