import Select from '../../inputs/Select';
import type { Job } from '../../types';
import { jobTypeToString } from '../utils';

const TYPES: Array<Job['type']> = [
  'full_time',
  'part_time',
  'contract',
  'internship'
];

const JobTypeSelect = ({
  value,
  width,
  showAny,
  onChange
}: {
  value?: Job['type'] | 0;
  width?: string;
  showAny?: boolean;
  onChange: (jobType: Job['type']) => void;
}) => {
  return (
    <Select
      id="job_type"
      value={value}
      width={width}
      onChange={(e) => onChange(e.target.value as Job['type'])}
    >
      <>
        {showAny && (
          <option key={0} value={0}>
            Any
          </option>
        )}
        {TYPES.map((type) => (
          <option key={type} value={type}>
            {jobTypeToString(type)}
          </option>
        ))}
      </>
    </Select>
  );
};

export default JobTypeSelect;
