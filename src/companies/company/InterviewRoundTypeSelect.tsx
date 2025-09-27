import { type RoundType, formatType, ROUND_TYPES } from './utils';

const InterviewRoundTypeSelect = ({
  type,
  idx,
  onChange
}: {
  type: RoundType;
  idx: number;
  onChange: (type: RoundType) => void;
}) => {
  return (
    <select
      id={`interview_round_type${idx ? `_${idx}` : ''}`}
      className="border-[0.5px] border-gray-500 h-[2.05rem] px-2 py-0.5"
      value={type}
      onChange={(e) => onChange(e.target.value as RoundType)}
    >
      {ROUND_TYPES?.map((type, idx) => (
        <option key={idx} value={type}>
          {formatType(type)}
        </option>
      ))}
    </select>
  );
};

export default InterviewRoundTypeSelect;
