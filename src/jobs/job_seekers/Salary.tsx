import type { Job as DbJob } from '../../types';
import { jobTypeToString } from '../utils';

export type SalaryProps = Pick<
  DbJob,
  'type' | 'salary_type' | 'salary_low' | 'salary_high'
>;

const Salary = ({
  type,
  salary_type,
  salary_low,
  salary_high
}: SalaryProps) => {
  return (
    <div className="text-xs font-bold pt-[5px] text-gray-600">
      {salary_low === salary_high && `$${salary_low.toLocaleString()}`}
      {salary_low !== salary_high &&
        `$${salary_low.toLocaleString()} - $${salary_high.toLocaleString()}`}{' '}
      {salary_type}, {jobTypeToString(type, false)}
    </div>
  );
};

export default Salary;
