import Select from '../../inputs/Select';
import type { JobType } from '../../types';
import { jobTypeToString } from '../utils';

const TYPES: Array<JobType> = [
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
  value?: JobType | 'any';
  width?: string;
  showAny?: boolean;
  onChange: (jobType: JobType) => void;
}) => {
  return (
    <Select
      id="job_type"
      value={value}
      width={width}
      onChange={(e) => onChange(e.target.value as JobType)}
    >
      <>
        {showAny && (
          <option key={0} value="any">
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
