import { capitalize } from 'lodash';
import Select from '../../inputs/Select';
import { type RoundLocation, ROUND_LOCATIONS } from './utils';

const InterviewRoundLocationSelect = ({
  location,
  idx,
  onChange
}: {
  location: RoundLocation;
  idx: number;
  onChange: (location: RoundLocation) => void;
}) => {
  return (
    <Select
      id={`interview_round_location${idx ? `_${idx}` : ''}`}
      value={location}
      onChange={(e) => onChange(e.target.value as RoundLocation)}
    >
      {ROUND_LOCATIONS?.map((location, idx) => (
        <option key={idx} value={location}>
          {capitalize(location)}
        </option>
      ))}
    </Select>
  );
};

export default InterviewRoundLocationSelect;
