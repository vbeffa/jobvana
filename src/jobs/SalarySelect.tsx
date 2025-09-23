import _ from 'lodash';
import { MAX_SALARY, MIN_SALARY } from './useJobs';

const salaries = _.range(MIN_SALARY, MAX_SALARY + 1, 10000);

const SalarySelect = ({
  id,
  value,
  width = 'w-full',
  onChange
}: {
  id: string;
  value?: number;
  width?: string;
  onChange: (salary: number) => void;
}) => {
  return (
    <select
      id={id}
      className={`border-[0.5px] border-gray-500 h-8 px-0 ${width} py-0.5`}
      value={value}
      onChange={(e) => onChange(parseInt(e.target.value))}
    >
      {salaries.map((salary, idx) => (
        <option key={idx} value={salary}>
          {new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            maximumFractionDigits: 0
          }).format(salary)}
        </option>
      ))}
    </select>
  );
};

export default SalarySelect;
