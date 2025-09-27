import _ from 'lodash';
import Select from '../../inputs/Select';
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
    <Select
      id={id}
      value={value}
      width="w-full"
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
    </Select>
  );
};

export default SalarySelect;
