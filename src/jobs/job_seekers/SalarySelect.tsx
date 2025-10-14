import _ from 'lodash';
import { useMemo } from 'react';
import Select from '../../inputs/Select';
import type { Job } from '../../types';
import { formatCurrency } from '../../utils';
import { maxJobSalary, minJobSalary } from '../utils';

const SalarySelect = ({
  type,
  id,
  value,
  width,
  onChange
}: {
  type: Job['salary_type'];
  id: string;
  value?: number;
  width?: string;
  onChange: (salary: number) => void;
}) => {
  const min = useMemo(() => minJobSalary(type), [type]);
  const max = useMemo(() => maxJobSalary(type), [type]);
  const step = useMemo(() => (type === 'annual' ? 10000 : 5), [type]);
  const salaries = useMemo(() => _.range(min, max + 1, step), [max, min, step]);

  return (
    <Select
      id={id}
      value={value}
      width={width}
      onChange={(e) => onChange(parseInt(e.target.value))}
    >
      {salaries.map((salary, idx) => (
        <option key={idx} value={salary}>
          {formatCurrency(salary)}
        </option>
      ))}
    </Select>
  );
};

export default SalarySelect;
