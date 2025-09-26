import { useMemo } from 'react';

const NumberInput = ({
  id,
  label,
  value,
  min,
  max,
  step = 1,
  showOutOfRange = true,
  showCurrency = false,
  onChange,
  width = 'w-full',
  pl = ''
}: {
  id: string;
  label?: string;
  value: number | null;
  min: number;
  max: number;
  step?: number;
  showOutOfRange?: boolean;
  showCurrency?: boolean;
  onChange: (value: number | null) => void;
  width?: string;
  pl?: string;
}) => {
  const outOfRange = useMemo(
    () => value !== null && (value < min || value > max),
    [max, min, value]
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
          step={step}
          min={min}
          max={max}
          placeholder={`${min} - ${max}`}
          className={`${pl} p-1 border-[0.5px] border-gray-500 h-8 ${width}`}
          value={value ?? ''}
          onChange={(e) => {
            if (e.target.value !== '-') {
              const parsed =
                step === 1
                  ? parseInt(e.target.value)
                  : parseFloat(e.target.value);
              onChange(isNaN(parsed) ? null : parsed);
            }
          }}
          onBlur={(e) => {
            let newSize: number | null =
              step === 1
                ? parseInt(e.target.value)
                : parseFloat(e.target.value);
            if (isNaN(newSize)) {
              newSize = null;
            }
            if (newSize !== value) {
              onChange(newSize);
            }
          }}
        />
        {showCurrency && <div className="absolute top-1 left-1">$</div>}
        {showOutOfRange && outOfRange && (
          <div className="absolute text-red-500 top-2 right-6 text-xs">
            Out of range
          </div>
        )}
      </div>
    </>
  );
};

export default NumberInput;
