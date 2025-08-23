import type { Job } from "../hooks/useJobs";
import Link from "../Link";

const JobLink = ({
  job,
  gotoJob
}: {
  job: Job;
  gotoJob: (jobId: number) => void;
}) => {
  return <Link text={job.title} onClick={() => gotoJob(job.id)} />;
};

export default JobLink;
