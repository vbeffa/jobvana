import type { Job } from '../../types';
import SalarySelect from './SalarySelect';

const SalaryRangeSelect = ({
  type,
  low,
  high,
  onChangeLow,
  onChangeHigh
}: {
  type: Job['salary_type'];
  low: number;
  high: number;
  onChangeLow: (minSalary: number) => void;
  onChangeHigh: (maxSalary: number) => void;
}) => {
  return (
    <>
      <label htmlFor="min_salary" className="content-center">
        Salary:
      </label>
      <div className="flex flex-row gap-x-2">
        <SalarySelect
          type={type}
          id="min_salary"
          value={low}
          onChange={onChangeLow}
        />
        <label htmlFor="max_salary" className="content-center">
          -
        </label>
        <SalarySelect
          type={type}
          id="max_salary"
          value={high}
          onChange={onChangeHigh}
        />
      </div>
    </>
  );
};

export default SalaryRangeSelect;
