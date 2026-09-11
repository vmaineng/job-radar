import JobCard from "@/components/JobCard";
import { Job } from "@/types";
import { TraceItem, TraceStep } from "./TraceItem";

export type DemoResult = {
  status: string;
  message?: string;
  candidate_profile?: string;
  saved_count?: number;
  trace?: TraceStep[];
  jobs?: Job[];
  is_prerecorded?: boolean;
};

const noop = () => {};

export function DemoResultView({ result }: { result: DemoResult }) {
  return (
    <div className="space-y-6">
      {result.is_prerecorded && (
        <div className="flex items-center gap-2 text-xs font-medium text-secondary bg-card border border-border rounded-full px-3 py-1 w-fit">
          <span className="w-1.5 h-1.5 rounded-full bg-primary" />
          Prerecorded demo run — not a live search
        </div>
      )}

      {result.candidate_profile && (
        <div className="text-sm bg-card border border-border rounded-lg p-4 text-secondary">
          <span className="font-medium">Scoring against:</span>{" "}
          {result.candidate_profile}
        </div>
      )}

      <div className="space-y-3">
        {result.trace?.map((step, i) => (
          <TraceItem key={i} step={step} />
        ))}
      </div>

      <div className="text-sm text-secondary pt-4 border-t border-border">
        {result.saved_count} posting{result.saved_count === 1 ? "" : "s"}{" "}
        evaluated and saved.
      </div>

      {result.jobs && result.jobs.length > 0 && (
        <div className="space-y-4 pt-2">
          <h2 className="text-lg font-semibold text-foreground">
            Matches from this run
          </h2>
          <div className="space-y-4">
            {result.jobs.map((job) => (
              <JobCard key={job.id} job={job} onMarkApplied={noop} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
