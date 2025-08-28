import _ from "lodash";

const salaries = _.range(10000, 200001, 10000);

const SalarySelect = ({
  id,
  title,
  value,
  onChange
}: {
  id: string;
  title: string;
  value?: number;
  onChange: (salary: number) => void;
}) => {
  return (
    <select
      id={id}
      className="border border-gray-500 rounded-lg h-8 px-2 py-0.5"
      value={value}
      onChange={(e) => onChange(parseInt(e.target.value))}
    >
      <option key={0} value="">
        {title}
      </option>
      {salaries.map((salary, idx) => (
        <option key={idx} value={salary}>
          {new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
            maximumFractionDigits: 0
          }).format(salary)}
        </option>
      ))}
    </select>
  );
};

export default SalarySelect;
