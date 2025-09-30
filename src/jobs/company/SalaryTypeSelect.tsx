import { capitalize } from 'lodash';
import Select from '../../inputs/Select';
import type { Job } from '../../types';

const TYPES: Array<Job['salary_type']> = ['annual', 'hourly'];

const SalaryTypeSelect = ({
  value,
  onChange
}: {
  value: Job['salary_type'];
  onChange: (salaryType: Job['salary_type']) => void;
}) => {
  return (
    <>
      <label htmlFor="salary_type" className="content-center">
        Salary Type:
      </label>
      <Select
        id="salary_type"
        value={value}
        width="w-23.5"
        onChange={(e) => onChange(e.target.value as Job['salary_type'])}
      >
        {TYPES.map((type) => (
          <option key={type} value={type}>
            {capitalize(type)}
          </option>
        ))}
      </Select>
    </>
  );
};

export default SalaryTypeSelect;
