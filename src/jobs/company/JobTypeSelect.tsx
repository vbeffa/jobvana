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
  onChange
}: {
  value: Job['type'];
  onChange: (jobType: Job['type']) => void;
}) => {
  return (
    <Select
      id="job_type"
      value={value}
      width="w-32"
      onChange={(e) => onChange(e.target.value as Job['type'])}
    >
      {TYPES.map((type) => (
        <option key={type} value={type}>
          {jobTypeToString(type)}
        </option>
      ))}
    </Select>
  );
};

export default JobTypeSelect;
