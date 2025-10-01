import NumberInput from '../../inputs/NumberInput';
import { MAX_COMPANY_SIZE, MIN_COMPANY_SIZE } from './useCompanies';

const CompanySizeFilters = ({
  low,
  high,
  width,
  onChangeLow,
  onChangeHigh
}: {
  low: number;
  high: number;
  width?: string;
  onChangeLow: (size: number | null) => void;
  onChangeHigh: (size: number | null) => void;
}) => {
  return (
    <>
      <div className="flex flex-row gap-x-2 h-[33px]">
        <NumberInput
          id="min_size"
          value={low}
          min={MIN_COMPANY_SIZE}
          max={MAX_COMPANY_SIZE}
          width={width}
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
          width={width}
          onChange={onChangeHigh}
        />
      </div>
    </>
  );
};

export default CompanySizeFilters;
