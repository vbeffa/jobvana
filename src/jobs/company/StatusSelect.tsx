import Select from '../../inputs/Select';
import type { Job } from '../../types';

const StatusSelect = ({
  status,
  isDraft,
  onChange
}: {
  status: string;
  isDraft: boolean;
  onChange: (status: Job['status']) => void;
}) => {
  let options = [
    <option key={2} value="open">
      Open
    </option>,
    <option key={3} value="closed">
      Closed
    </option>,
    <option key={4} value="filled">
      Filled
    </option>
  ];
  if (isDraft) {
    options = [
      <option key={1} value="draft">
        Draft
      </option>
    ].concat(options);
  }
  return (
    <div>
      <Select
        id="status"
        value={status}
        width="w-34"
        disabled={true}
        onChange={(e) => {
          const status = e.target.value as Job['status'];
          onChange(status);
        }}
      >
        {options}
      </Select>
    </div>
  );
};

export default StatusSelect;
