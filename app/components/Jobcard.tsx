import { Job } from "../types";

type jobProps = {
  job: Job;
  onMarkApplied: (id: string) => void;
};
