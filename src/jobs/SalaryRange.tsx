import SalarySelect from './SalarySelect';

const SalaryRange = ({
  low,
  high,
  onChange
}: {
  low: number;
  high: number;
  onChange: (salary: number) => void;
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
          onChange={onChange}
        />
        <label htmlFor="max_salary" className="content-center">
          -
        </label>
        <SalarySelect
          id="max_salary"
          value={high}
          width="w-32"
          onChange={onChange}
        />
      </div>
    </>
  );
};

export default SalaryRange;
