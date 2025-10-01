import type { Job } from '../../types';
import SalarySelect from './SalarySelect';

const SalaryRangeSelect = ({
  type,
  low,
  high,
  width,
  onChangeLow,
  onChangeHigh
}: {
  type: Job['salary_type'];
  low: number;
  high: number;
  width?: string;
  onChangeLow: (minSalary: number) => void;
  onChangeHigh: (maxSalary: number) => void;
}) => {
  return (
    <>
      <div className="flex flex-row gap-x-2">
        <SalarySelect
          type={type}
          id="min_salary"
          value={low}
          width={width}
          onChange={onChangeLow}
        />
        <label htmlFor="max_salary" className="content-center">
          -
        </label>
        <SalarySelect
          type={type}
          id="max_salary"
          value={high}
          width={width}
          onChange={onChangeHigh}
        />
      </div>
    </>
  );
};

export default SalaryRangeSelect;
