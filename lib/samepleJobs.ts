import { Job } from "@/types";

export const SAMPLE_JOBS: Job[] = [
  {
    id: "sample-1",
    title: "Junior Frontend Engineer",
    company: "Acme Robotics",
    location: "Los Angeles, CA",
    is_remote: false,
    relevance_score: 92,
    relevance_reason:
      "Strong match on React + TypeScript experience and your recent bootcamp projects.",
    apply_url: "#",
    status: "new",
    contact: {
      full_name: "Jordan Reyes",
      title: "Engineering Manager",
      email: null,
      linkedin_search_url:
        "https://www.linkedin.com/search/results/people/?keywords=Jordan%20Reyes%20Acme%20Robotics",
      source: "sample",
    },
  },
  {
    id: "sample-2",
    title: "Associate Software Engineer",
    company: "Northwind Labs",
    location: "Remote",
    is_remote: true,
    relevance_score: 87,
    relevance_reason:
      "Entry-level title match with FastAPI backend work aligning to your recent projects.",
    apply_url: "#",
    status: "new",
    contact: {
      full_name: "Test2",
      title: "CTO",
      email: "test@gmail.com",
      linkedin_search_url: "https://www.linkedin.com/search/results/people/?keywords=Maya%20Chen%20Northwind%20Labs",
      source: "LinkedIn",
    },
  },
];
