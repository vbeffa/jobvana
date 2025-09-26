import InterviewRoundDuration from './InterviewRoundDuration';
import InterviewRoundLocationSelect from './InterviewRoundLocationSelect';
import InterviewRoundTypeSelect from './InterviewRoundTypeSelect';
import type { InterviewRound } from './utils';

const InterviewRoundEdit = ({
  round,
  idx,
  onChange
}: {
  round: InterviewRound;
  idx?: number;
  onChange: (round: InterviewRound) => void;
}) => {
  return (
    <>
      <InterviewRoundTypeSelect
        type={round.type}
        idx={idx}
        onChange={(type) => {
          onChange({
            ...round,
            type
          });
        }}
      />
      <InterviewRoundLocationSelect
        location={round.location}
        idx={idx}
        onChange={(location) => {
          onChange({
            ...round,
            location
          });
        }}
      />
      <InterviewRoundDuration
        duration={round.duration}
        unit={round.durationUnit}
        idx={idx}
        onChangeDuration={(duration) => {
          onChange({
            ...round,
            duration
          });
        }}
        onChangeUnit={(durationUnit) => {
          onChange({
            ...round,
            duration:
              durationUnit === 'hour'
                ? round.duration
                : Math.round(round.duration),
            durationUnit
          });
        }}
      />
    </>
  );
};

export default InterviewRoundEdit;
