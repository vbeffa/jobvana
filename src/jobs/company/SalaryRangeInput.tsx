import NumberInput from '../../inputs/NumberInput';
import { MAX_SALARY, MIN_SALARY } from '../job_seekers/useJobs';

const SalaryRangeInput = ({
  low,
  high,
  onChangeLow,
  onChangeHigh
}: {
  low: number;
  high: number;
  onChangeLow: (minSalary: number | null) => void;
  onChangeHigh: (maxSalary: number | null) => void;
}) => {
  return (
    <>
      <label htmlFor="min_salary" className="content-center">
        Salary:
      </label>
      <div className="flex flex-row gap-x-2">
        <NumberInput
          id="min_salary"
          value={low}
          min={MIN_SALARY}
          max={MAX_SALARY}
          step={1000}
          width="w-32"
          showCurrency={true}
          onChange={onChangeLow}
        />
        <label htmlFor="max_salary" className="content-center">
          -
        </label>
        <NumberInput
          id="max_salary"
          value={high}
          min={MIN_SALARY}
          max={MAX_SALARY}
          step={1000}
          width="w-32"
          showCurrency={true}
          onChange={onChangeHigh}
        />
      </div>
    </>
  );
};

export default SalaryRangeInput;
