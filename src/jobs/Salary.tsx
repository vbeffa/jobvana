import type { Job as DbJob } from '../hooks/types';

export type SalaryProps = Pick<DbJob, 'salary_low' | 'salary_high'>;

const Salary = ({ salary_low, salary_high }: SalaryProps) => {
  return (
    <div className="text-xs font-bold pt-[5px] text-gray-600">
      {salary_low === salary_high && `$${salary_low.toLocaleString()}`}
      {salary_low !== salary_high &&
        `$${salary_low.toLocaleString()} - $${salary_high.toLocaleString()}`}
    </div>
  );
};

export default Salary;
