import Select from '../../inputs/Select';
import type { JobStatus } from '../../types';

const StatusSelect = ({
  status,
  onChange
}: {
  status?: JobStatus | 'all';
  onChange: (status: JobStatus | 'all') => void;
}) => {
  return (
    <div>
      <Select
        id="status"
        value={status}
        width="w-34"
        onChange={(e) => {
          const status = e.target.value as JobStatus | 'all';
          onChange(status);
        }}
      >
        <option key={0} value="all">
          All
        </option>
        <option key={1} value="draft">
          Draft
        </option>
        <option key={2} value="open">
          Open
        </option>
        <option key={3} value="closed">
          Closed
        </option>
        <option key={4} value="filled">
          Filled
        </option>
      </Select>
    </div>
  );
};

export default StatusSelect;
