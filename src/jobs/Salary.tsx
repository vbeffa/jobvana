import type { Job } from '../hooks/useJobs';

export type SalaryProps = Pick<Job, 'salary_low' | 'salary_high'>;

const Salary = ({ salary_low, salary_high }: SalaryProps) => {
  return (
    <div className="text-xs font-bold pt-[5.5px] text-gray-600">
      {salary_low === salary_high && `$${salary_low.toLocaleString()}`}
      {salary_low !== salary_high &&
        `$${salary_low.toLocaleString()} - $${salary_high.toLocaleString()}`}
    </div>
  );
};

export default Salary;
