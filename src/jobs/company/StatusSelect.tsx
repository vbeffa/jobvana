import Select from '../../inputs/Select';
import type { Job } from '../../types';

const StatusSelect = ({
  status,
  onChange
}: {
  status: string;
  onChange: (status: Job['status']) => void;
}) => {
  return (
    <>
      <label htmlFor="status" className="content-center">
        Status:
      </label>
      <div>
        <Select
          id="status"
          value={status}
          width="w-23.5"
          onChange={(e) => {
            const status = e.target.value as Job['status'];
            onChange(status);
          }}
        >
          <option key={1} value="open">
            Open
          </option>
          <option key={2} value="closed">
            Closed
          </option>
          <option key={3} value="filled">
            Filled
          </option>
        </Select>
      </div>
    </>
  );
};

export default StatusSelect;
