export function renderResultSummary(step: {
  tool: string;
  result: Record<string, unknown>;
}) {
  if (step.tool === "search_jobs") {
    return `Found ${step.result.count} new posting(s).`;
  }
  if (step.tool === "save_to_dashboard") {
    return step.result.status === "saved"
      ? "Saved to dashboard."
      : "Skipped (already seen).";
  }
  if (step.tool === "enrich_contact") {
    const source = step.result.source as string;
    if (source === "hunter") return `Found contact: ${step.result.full_name}`;
    if (source === "score_too_low") return "Skipped — score below threshold.";
    return "Enrichment unavailable for this run.";
  }
  return null;
}
