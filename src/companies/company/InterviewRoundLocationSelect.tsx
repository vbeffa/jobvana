import { capitalize } from 'lodash';
import { type RoundLocation, ROUND_LOCATIONS } from './utils';

const InterviewRoundLocationSelect = ({
  location,
  idx,
  onChange,
  showEmpty
}: {
  location?: RoundLocation;
  idx?: number;
  onChange: (location: RoundLocation) => void;
  showEmpty?: boolean;
}) => {
  return (
    <select
      id={`interview_round_location${idx ? `_${idx}` : ''}`}
      className="border-[0.5px] border-gray-500 h-[2.05rem] px-2 py-0.5"
      value={location}
      onChange={(e) => onChange(e.target.value as RoundLocation)}
    >
      {showEmpty && <option key={0} value="" />}
      {ROUND_LOCATIONS?.map((location, idx) => (
        <option key={idx} value={location}>
          {capitalize(location)}
        </option>
      ))}
    </select>
  );
};

export default InterviewRoundLocationSelect;
