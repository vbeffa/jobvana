import type { Job } from '../hooks/useJobs';

const Salary = ({ job }: { job: Job }) => {
  return (
    <>
      {job.salary_low === job.salary_high &&
        `$${job.salary_low.toLocaleString()}`}
      {job.salary_low !== job.salary_high &&
        `$${job.salary_low.toLocaleString()} - $${job.salary_high.toLocaleString()}`}
    </>
  );
};

export default Salary;
