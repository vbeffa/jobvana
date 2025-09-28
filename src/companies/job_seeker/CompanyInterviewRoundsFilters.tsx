import NumberInput from '../../inputs/NumberInput';

const CompanyInterviewRoundsFilters = ({
  low,
  high,
  onChangeLow,
  onChangeHigh
}: {
  low: number;
  high: number;
  onChangeLow: (rounds: number | null) => void;
  onChangeHigh: (rounds: number | null) => void;
}) => {
  return (
    <>
      <label htmlFor="min_rounds" className="content-center">
        Rounds:
      </label>
      <div className="flex flex-row gap-x-2 h-[33px]">
        <NumberInput
          id="min_rounds"
          value={low}
          disabled={true}
          min={1}
          max={5}
          width="w-27"
          onChange={onChangeLow}
        />
        <label htmlFor="max_size" className="content-center">
          -
        </label>
        <NumberInput
          id="max_rounds"
          value={high}
          disabled={true}
          min={1}
          max={5}
          width="w-27"
          onChange={onChangeHigh}
        />
      </div>
    </>
  );
};

export default CompanyInterviewRoundsFilters;
