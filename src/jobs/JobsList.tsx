import JobLink, { type JobLinkProps } from './JobLink';

export type JobsListProps = {
  jobs: Array<JobLinkProps>;
};

const JobsList = ({ jobs }: JobsListProps) => {
  return (
    <ul>
      {jobs.map((job) => (
        <li key={job.id}>
          <JobLink {...job} />
        </li>
      ))}
    </ul>
  );
};

export default JobsList;
