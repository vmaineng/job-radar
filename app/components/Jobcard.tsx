import { Job } from "../types";
import ContactInfo from "./ContactInfo";

type jobProps = {
  job: Job;
  onMarkApplied: (id: string) => void;
};

export default function JobCard({ job, onMarkApplied }: jobProps) {
  return (
    <div className="border rounded-xl p-4 flex justify-between items-start gap-4">
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <h2 className="font-medium text-lg">{job.title}</h2>
          <span className="text-xs bg-gray-100 rounded-full px-2 py-0.5">
            {job.relevance_score}% match
          </span>
          {job.is_remote && (
            <span className="text-xs bg-blue-100 text-blue-700 rounded-full px-2 py-0.5">
              Remote
            </span>
          )}
        </div>

        <p className="text-gray-600">
          {job.company} · {job.location}
        </p>

        <p className="text-sm text-gray-500 mt-1">{job.relevance_reason}</p>
        <ContactInfo job={job} />
      </div>

      <div className="flex flex-col gap-2 shrink-0">
        <a
          href={job.apply_url}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-black text-white text-sm rounded-lg px-3 py-1.5 text-center"
        >
          Apply
        </a>
        {job.status !== "applied" && (
          <button
            onClick={() => onMarkApplied(job.id)}
            className="text-sm text-gray-500 border rounded-lg px-3 py-1.5"
          >
            Mark applied
          </button>
        )}
      </div>
    </div>
  );
}
