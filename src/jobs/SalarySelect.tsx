import _ from 'lodash';
import { MAX_SALARY, MIN_SALARY } from './useJobs';

const salaries = _.range(MIN_SALARY, MAX_SALARY + 1, 10000);

const SalarySelect = ({
  id,
  value,
  onChange
}: {
  id: string;
  value?: number;
  onChange: (salary: number) => void;
}) => {
  return (
    <select
      id={id}
      className="border border-gray-500 h-8 px-2 py-0.5"
      value={value}
      onChange={(e) => onChange(parseInt(e.target.value))}
    >
      {salaries.map((salary, idx) => (
        <option
          key={idx}
          value={salary}
          // selected={type === 'min' ? idx === 0 : idx === salaries.length - 1}
        >
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
