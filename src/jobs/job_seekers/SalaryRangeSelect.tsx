import SalarySelect from './SalarySelect';

const SalaryRangeSelect = ({
  low,
  high,
  onChangeLow,
  onChangeHigh
}: {
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
          id="min_salary"
          value={low}
          width="w-32"
          onChange={onChangeLow}
        />
        <label htmlFor="max_salary" className="content-center">
          -
        </label>
        <SalarySelect
          id="max_salary"
          value={high}
          width="w-32"
          onChange={onChangeHigh}
        />
      </div>
    </>
  );
};

export default SalaryRangeSelect;
