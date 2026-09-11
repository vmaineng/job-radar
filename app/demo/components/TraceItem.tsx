import { renderResultSummary } from "@/lib/formatTraceResult";
import { memo } from "react";

export type TraceStep =
  | { type: "reasoning"; text: string }
  | { type: "tool_call"; tool: string; input: Record<string, unknown> }
  | { type: "tool_result"; tool: string; result: Record<string, unknown> }
  | { type: "system"; text: string };

const TOOL_LABELS: Record<string, string> = {
  search_jobs: "🔍 Searching for postings",
  save_to_dashboard: "💾 Saving scored posting",
  enrich_contact: "📇 Looking up a contact",
};

export const TraceItem = memo(function TraceItem({
  step,
}: {
  step: TraceStep;
}) {
  if (step.type === "reasoning") {
    return (
      <p className="text-foreground italic pl-2 border-l-2 border-border">
        {step.text}
      </p>
    );
  }
  if (step.type === "tool_call") {
    return (
      <div className="bg-primary/10 border border-primary/20 rounded-md px-3 py-2 text-sm text-foreground">
        <span className="font-medium">
          {TOOL_LABELS[step.tool] ?? step.tool}
        </span>
      </div>
    );
  }
  if (step.type === "tool_result") {
    return (
      <div className="bg-card border border-border rounded-md px-3 py-2 text-sm text-secondary">
        {renderResultSummary(step)}
      </div>
    );
  }
  return <p className="text-xs text-secondary">{step.text}</p>;
});
