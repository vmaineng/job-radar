import { Job } from "../types";
import ContactInfo from "./ContactInfo";

type jobProps = {
  job: Job;
  onMarkApplied: (id: string) => void;
};

export default function JobCard({ job, onMarkApplied }: jobProps) {
  return (
    <div
      className="bg-card
        border
        border-border
        rounded-2xl
        p-5
        flex
        justify-between
        items-start
        gap-6
        transition-all
        hover:border-primary/40
        hover:shadow-md"
    >
      <div className="flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="text-lg font-semibold">{job.title}</h2>
          <span
            className="rounded-full
              bg-primary/10
              px-3
              py-1
              text-xs
              font-medium
              text-primary"
          >
            {job.relevance_score}% match
          </span>
          {job.is_remote && (
            <span
              className="rounded-full
                bg-green-500/10
                px-3
                py-1
                text-xs
                font-medium
                text-green-500"
            >
              Remote
            </span>
          )}
        </div>

        <p className="mt-1 text-secondary">
          {job.company} · {job.location}
        </p>

        <p className="mt-3 text-sm text-secondary">{job.relevance_reason}</p>
        <div className="mt-4">
          <ContactInfo job={job} />
        </div>
      </div>

      <div className="flex shrink-0 flex-col gap-3">
        <a
          href={job.apply_url}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-xl
            bg-primary
            px-4
            py-2
            text-center
            text-sm
            font-medium
           border
           border-border
            transition-colors
            hover:bg-primary-hover"
        >
          Apply
        </a>
        {job.status !== "applied" && (
          <button
            onClick={() => onMarkApplied(job.id)}
            className="rounded-xl
              border
              border-border
              px-4
              py-2
              text-sm
              text-secondary
              transition-colors
              hover:bg-surface
              hover:text-foreground"
          >
            Mark applied
          </button>
        )}
      </div>
    </div>
  );
}
