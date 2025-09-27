import NumberInput from '../../inputs/NumberInput';
import { type DurationUnit, ROUND_UNITS } from './utils';

const InterviewRoundDuration = ({
  duration,
  unit,
  idx,
  onChangeDuration,
  onChangeUnit
}: {
  duration: number;
  unit: DurationUnit;
  idx?: number;
  onChangeDuration: (duration: number) => void;
  onChangeUnit: (unit: DurationUnit) => void;
}) => {
  const max = unit === 'minute' ? 60 : unit === 'hour' ? 12 : 30;
  const step = unit === 'minute' ? 1 : unit === 'hour' ? 0.25 : 1;

  return (
    <>
      <NumberInput
        id={`interview_round_duration${idx ? `_${idx}` : ''}`}
        value={duration}
        min={0}
        max={max}
        step={step}
        onChange={(duration) => {
          console.log(duration);
          if (duration) {
            onChangeDuration(duration);
          }
        }}
      />
      <select
        id={`interview_round_duration_unit${idx ? `_${idx}` : ''}`}
        className="border-[0.5px] border-gray-500 h-[2.05rem] px-2 py-0.5"
        value={unit}
        onChange={(e) => onChangeUnit(e.target.value as DurationUnit)}
      >
        {ROUND_UNITS?.map((unit, idx) => (
          <option key={idx} value={unit}>
            {unit}
            {duration !== 1 && 's'}
          </option>
        ))}
      </select>
    </>
  );
};

export default InterviewRoundDuration;
