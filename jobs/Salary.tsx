import "../src/App.css";
import type { Job } from "../src/hooks/useJobs";

function Salary({ job }: { job: Job }) {
  return (
    <>
      {job.salaryLow === job.salaryHigh && `$${job.salaryLow.toLocaleString()}`}
      {job.salaryLow !== job.salaryHigh &&
        `$${job.salaryLow.toLocaleString()} - $${job.salaryHigh.toLocaleString()}`}
    </>
  );
}

export default Salary;
