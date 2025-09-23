import type { CreatedRange } from '../jobs/useJobs';

const CreatedSelect = ({
  id,
  value,
  onChange
}: {
  id: string;
  value?: CreatedRange;
  onChange: (value: CreatedRange) => void;
}) => {
  return (
    <select
      id={id}
      className="border-[0.5px] border-gray-500 h-8 py-0.5"
      value={value}
      onChange={(e) => onChange(e.target.value as CreatedRange)}
    >
      <option key={0} value="all">
        Any Time
      </option>
      <option key={1} value="today">
        Today
      </option>
      <option key={2} value="last_three_days">
        Last 3 Days
      </option>
      <option key={3} value="last_week">
        Last Week
      </option>
      <option key={4} value="last_month">
        Last Month
      </option>
    </select>
  );
};

export default CreatedSelect;
