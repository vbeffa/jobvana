import { capitalize } from 'lodash';
import Select from '../../inputs/Select';
import type { JobSalaryType } from '../../types';

const TYPES: Array<JobSalaryType> = ['annual', 'hourly'];

const SalaryTypeSelect = ({
  value,
  width = 'w-32',
  onChange
}: {
  value?: JobSalaryType;
  width?: string;
  onChange: (salaryType: JobSalaryType) => void;
}) => {
  return (
    <Select
      id="salary_type"
      value={value}
      width={width}
      onChange={(e) => onChange(e.target.value as JobSalaryType)}
    >
      {TYPES.map((type) => (
        <option key={type} value={type}>
          {capitalize(type)}
        </option>
      ))}
    </Select>
  );
};

export default SalaryTypeSelect;
