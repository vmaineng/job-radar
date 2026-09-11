"use client";

import { useState } from "react";
import MarketingNavbar from "@/app/(marketing)/components/MarketingNavbar";
import { useDemoRun } from "@/hooks/useDemoRun";
import { DemoRunForm } from "./components/DemoRunForm";
import { DemoResult, DemoResultView } from "./components/DemoResultView";

const PRESETS = [
  { key: "junior_swe_la", label: "Junior Software Engineer — Los Angeles" },
  {
    key: "associate_swe_remote",
    label: "Associate Software Engineer — Remote",
  },
  { key: "solutions_analyst", label: "Solutions Analyst I — Los Angeles" },
];

export default function DemoPage() {
  const [email, setEmail] = useState("");
  const [preset, setPreset] = useState(PRESETS[0].key);
  const { loading, result, error, run } =
    useDemoRun<DemoResult>("/api/demo-run");

  return (
    <div className="max-w-2xl mx-auto px-4 py-30">
      <MarketingNavbar />
      <h1 className="text-2xl font-semibold mb-2 text-foreground">
        Watch the Job Radar agent work
      </h1>
      <p className="text-secondary mb-8">
        Job Radar is an AI agent that searches, scores, and enriches job
        postings on its own — pick a search below and watch it reason through
        each step.
      </p>

      {!result && (
        <DemoRunForm
          email={email}
          onEmailChange={setEmail}
          preset={preset}
          onPresetChange={setPreset}
          presets={PRESETS}
          loading={loading}
          error={error}
          onSubmit={() => run({ email, preset })}
        />
      )}

      {result && <DemoResultView result={result} />}
    </div>
  );
}
