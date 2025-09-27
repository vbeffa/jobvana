import NumberInput from '../../inputs/NumberInput';
import { MAX_COMPANY_SIZE, MIN_COMPANY_SIZE } from './useCompanies';

const CompanySizeFilters = ({
  low,
  high,
  onChangeLow,
  onChangeHigh
}: {
  low: number;
  high: number;
  onChangeLow: (size: number | null) => void;
  onChangeHigh: (size: number | null) => void;
}) => {
  return (
    <>
      <label htmlFor="min_size" className="content-center">
        Size:
      </label>
      <div className="flex flex-row gap-x-2">
        <NumberInput
          id="min_size"
          value={low}
          min={MIN_COMPANY_SIZE}
          max={MAX_COMPANY_SIZE}
          width="w-fit"
          showOutOfRange={false}
          onChange={onChangeLow}
        />
        <label htmlFor="max_size" className="content-center">
          -
        </label>
        <NumberInput
          id="max_size"
          value={high}
          min={MIN_COMPANY_SIZE}
          max={MAX_COMPANY_SIZE}
          width="w-fit"
          showOutOfRange={false}
          onChange={onChangeHigh}
        />
        {(low < MIN_COMPANY_SIZE || high > MAX_COMPANY_SIZE) && (
          <div className="text-sm text-red-500 content-center">
            ({MIN_COMPANY_SIZE} - {MAX_COMPANY_SIZE})
          </div>
        )}
      </div>
    </>
  );
};

export default CompanySizeFilters;
