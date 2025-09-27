import { capitalize } from 'lodash';
import { useMemo } from 'react';
import NumberInput from '../../inputs/NumberInput';
import Select from '../../inputs/Select';
import {
  formatType,
  ROUND_TYPES,
  type DurationUnit,
  type InterviewRound,
  type RoundLocation,
  type RoundType
} from './utils';

const InterviewRoundEdit = ({
  round,
  idx,
  onChange
}: {
  round: InterviewRound;
  idx: number;
  onChange: (round: InterviewRound) => void;
}) => {
  const { type, location, duration, durationUnit } = round;
  const min =
    durationUnit === 'minute' ? 1 : durationUnit === 'hour' ? 0.25 : 1;
  const max =
    durationUnit === 'minute' ? 60 : durationUnit === 'hour' ? 12 : 30;
  const step =
    durationUnit === 'minute' ? 1 : durationUnit === 'hour' ? 0.25 : 1;

  const availableLocations: Array<RoundLocation> = useMemo(() => {
    return type === 'take_home' ? ['offline'] : ['phone', 'video', 'office'];
  }, [type]);

  const availableDurationUnits: Array<DurationUnit> = useMemo(() => {
    return type === 'take_home' ? ['day'] : ['minute', 'hour'];
  }, [type]);

  return (
    <>
      <Select
        id={`interview_round_type${idx ? `_${idx}` : ''}`}
        value={type}
        onChange={(e) => {
          onChange({
            ...round,
            type: e.target.value as RoundType
          });
        }}
      >
        {ROUND_TYPES?.map((type, idx) => (
          <option key={idx} value={type}>
            {formatType(type)}
          </option>
        ))}
      </Select>
      <div className="flex justify-center">
        <Select
          id={`interview_round_location${idx ? `_${idx}` : ''}`}
          value={location}
          disabled={type === 'take_home'}
          width="w-24"
          onChange={(e) => {
            onChange({
              ...round,
              location: e.target.value as RoundLocation
            });
          }}
        >
          {availableLocations?.map((location, idx) => (
            <option key={idx} value={location}>
              {capitalize(location)}
            </option>
          ))}
        </Select>
      </div>
      <div className="flex justify-end">
        <NumberInput
          id={`interview_round_duration${idx ? `_${idx}` : ''}`}
          value={duration}
          min={min}
          max={max}
          step={step}
          width="w-24"
          onChange={(duration) => {
            if (duration) {
              onChange({
                ...round,
                duration
              });
            }
          }}
        />
      </div>
      <Select
        id={`interview_round_duration_unit${idx ? `_${idx}` : ''}`}
        value={durationUnit}
        disabled={type === 'take_home'}
        width="w-24"
        onChange={(e) => {
          const durationUnit = e.target.value as DurationUnit;
          onChange({
            ...round,
            duration: durationUnit === 'hour' ? duration : Math.round(duration),
            durationUnit
          });
        }}
      >
        {availableDurationUnits?.map((unit, idx) => (
          <option key={idx} value={unit}>
            {capitalize(unit)}
            {duration !== 1 && 's'}
          </option>
        ))}
      </Select>
    </>
  );
};

export default InterviewRoundEdit;
