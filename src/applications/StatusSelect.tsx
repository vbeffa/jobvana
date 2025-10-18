import { capitalize } from 'lodash';
import Label from '../inputs/Label';
import Select from '../inputs/Select';
import type { ApplicationStatus } from '../types';

const STATUSES: Array<ApplicationStatus> = [
  'submitted',
  'accepted',
  'declined',
  'withdrawn'
];

const StatusSelect = ({
  status,
  onChange
}: {
  status: ApplicationStatus | 'all';
  onChange: (status: ApplicationStatus | 'all') => void;
}) => {
  return (
    <>
      <Label htmlFor="application_status" label="Status" />
      <Select
        id="application_status"
        value={status}
        width="w-34"
        onChange={(e) => {
          const status = e.target.value;
          onChange(status as ApplicationStatus | 'all');
        }}
      >
        <>
          <option key={0} value="all">
            All
          </option>
          {STATUSES.map((status, idx) => (
            <option key={idx} value={status}>
              {capitalize(status)}
            </option>
          ))}
        </>
      </Select>
    </>
  );
};

export default StatusSelect;
