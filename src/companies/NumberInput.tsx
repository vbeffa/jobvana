import { useMemo } from 'react';
import { MAX_COMPANY_SIZE, MIN_COMPANY_SIZE } from './useCompanies';

const NumberInput = ({
  id,
  label,
  size,
  onChange
}: {
  id: string;
  label?: string;
  size: number | null;
  onChange: (size: number | null) => void;
}) => {
  const outOfRange = useMemo(
    () => size !== null && (size < MIN_COMPANY_SIZE || size > MAX_COMPANY_SIZE),
    [size]
  );

  return (
    <>
      {label && (
        <label htmlFor={id} className="content-center">
          {label}:
        </label>
      )}
      <div className="relative">
        <input
          id={id}
          type="number"
          step={1}
          min={MIN_COMPANY_SIZE}
          max={MAX_COMPANY_SIZE}
          placeholder={`${MIN_COMPANY_SIZE} - ${MAX_COMPANY_SIZE}`}
          className="p-1 border-[0.5px] h-8 w-full"
          value={size ?? ''}
          onChange={(e) => {
            if (e.target.value !== '-') {
              const parsed = parseInt(e.target.value);
              onChange(isNaN(parsed) ? null : parsed);
            }
          }}
          onBlur={(e) => {
            let size: number | null = parseInt(e.target.value);
            if (isNaN(size)) {
              size = null;
            }
            onChange(size);
          }}
        />
        {outOfRange && (
          <div className="absolute text-red-500 top-2 right-6 text-xs">
            Out of range
          </div>
        )}
      </div>
    </>
  );
};

export default NumberInput;
