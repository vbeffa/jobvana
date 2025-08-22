import "../src/App.css";
import type { Job } from "../src/hooks/useJobs";

function JobLink({ job }: { job: Job }) {
  return <a href={`/jobvana/jobs/?id=${job.id}`}>{job.title}</a>;
}

export default JobLink;
