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
        <select
          id="status"
          className="border-[0.5px] border-gray-500 h-8 w-32"
          value={status}
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
        </select>
      </div>
    </>
  );
};

export default StatusSelect;
