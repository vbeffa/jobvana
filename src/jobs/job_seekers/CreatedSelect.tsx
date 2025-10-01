import Select from '../../inputs/Select';
import type { CreatedRange } from './useJobs';

const CreatedSelect = ({
  id,
  value,
  width,
  onChange
}: {
  id: string;
  value?: CreatedRange;
  width?: string;
  onChange: (value: CreatedRange) => void;
}) => {
  return (
    <Select
      id={id}
      value={value}
      width={width}
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
    </Select>
  );
};

export default CreatedSelect;
