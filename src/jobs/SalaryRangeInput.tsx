import { FaTriangleExclamation } from 'react-icons/fa6';
import NumberInput from '../inputs/NumberInput';
import { MAX_SALARY, MIN_SALARY } from './useJobs';

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
          pl="pl-4"
          showOutOfRange={false}
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
          pl="pl-4"
          showOutOfRange={false}
          showCurrency={true}
          onChange={onChangeHigh}
        />
        {(low < MIN_SALARY || high > MAX_SALARY) && (
          <div className="text-sm text-red-500 flex flex-row gap-1">
            <div className="content-center">
              <FaTriangleExclamation />
            </div>
            <div className="content-center">Out of range</div>
          </div>
        )}
      </div>
    </>
  );
};

export default SalaryRangeInput;
