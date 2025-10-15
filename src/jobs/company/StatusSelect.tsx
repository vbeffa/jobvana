import Select from '../../inputs/Select';
import type { JobStatus } from '../../types';

const StatusSelect = ({
  status,
  disabled,
  onChange
}: {
  status: JobStatus | 'all';
  disabled?: boolean;
  onChange: (status: JobStatus | 'all') => void;
}) => {
  // const link = (linkStatus: JobStatus | 'all') => (
  //   <div
  //     className={`${linkStatus === status ? 'border-b-2 border-blue-500' : ''} flex flex-row items-center gap-1 cursor-pointer`}
  //     onClick={() => onChange(linkStatus)}
  //   >
  //     <div className="text-sm">
  //       <FaDraftingCompass />
  //     </div>
  //     {capitalize(linkStatus)}
  //   </div>
  // );

  return (
    <div>
      {/* <div className="flex flex-row gap-2">
      {link('all')}
      {link('draft')}
      {link('open')}
      {link('closed')}
      {link('filled')} */}

      <Select
        id="status"
        value={status}
        width="w-34"
        disabled={disabled}
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
