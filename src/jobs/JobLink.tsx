import { Link } from "@tanstack/react-router";
import { type Job } from "../hooks/useJobs";

const JobLink = ({ job }: { job: Job }) => {
  return (
    <Link to="/jobvana/jobs/$id" params={{ id: job.id.toString() }}>
      {job.role?.name}
    </Link>
  );
};

export default JobLink;
