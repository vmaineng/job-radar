import { Job } from "../types";

type Props = {
  job: Job;
};

export default function ContactInfo({ job }: Props) {
  const contact = job.contacts?.[0];
  if (!contact) return null;

  return (
    <div className="mt-3 text-sm border-t pt-2">
      {contact.full_name ? (
        <span>
          Contact: <strong>{contact.full_name}</strong>
          {contact.title ? `(${contact.title})` : ""}
          {contact.email ?? "no email found"}
        </span>
      ) : (
        <a
          href={contact.linkedin_search_url ?? "#"}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 underline"
        >
          Search for a contact on LinkedIn
        </a>
      )}
    </div>
  );
}
