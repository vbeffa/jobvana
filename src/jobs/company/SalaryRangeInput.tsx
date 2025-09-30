import { useMemo } from 'react';
import NumberInput from '../../inputs/NumberInput';
import type { Job } from '../../types';
import { maxJobSalary, minJobSalary } from './utils';

const SalaryRangeInput = ({
  type,
  low,
  high,
  onChangeLow,
  onChangeHigh
}: {
  type: Job['salary_type'];
  low: number;
  high: number;
  onChangeLow: (minSalary: number | null) => void;
  onChangeHigh: (maxSalary: number | null) => void;
}) => {
  const min = useMemo(() => minJobSalary(type), [type]);
  const max = useMemo(() => maxJobSalary(type), [type]);
  const step = useMemo(() => (type === 'annual' ? 1000 : 1), [type]);

  return (
    <div className="w-[50%] flex flex-row gap-x-2">
      <NumberInput
        id="min_salary"
        value={low}
        min={min}
        max={max}
        step={step}
        width="w-34"
        showCurrency={true}
        onChange={onChangeLow}
      />
      <label htmlFor="max_salary" className="content-center">
        -
      </label>
      <NumberInput
        id="max_salary"
        value={high}
        min={min}
        max={max}
        step={step}
        width="w-34"
        showCurrency={true}
        onChange={onChangeHigh}
      />
    </div>
  );
};

export default SalaryRangeInput;
