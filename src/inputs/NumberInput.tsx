import { useMemo } from 'react';

const NumberInput = ({
  id,
  label,
  value,
  min,
  max,
  onChange,
  width = 'w-full'
}: {
  id: string;
  label?: string;
  value: number | null;
  min: number;
  max: number;
  onChange: (value: number | null) => void;
  width?: string;
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
          step={1}
          min={min}
          max={max}
          placeholder={`${min} - ${max}`}
          className={`p-1 border-[0.5px] border-gray-500 h-8 ${width}`}
          value={value ?? ''}
          onChange={(e) => {
            if (e.target.value !== '-') {
              const parsed = parseInt(e.target.value);
              onChange(isNaN(parsed) ? null : parsed);
            }
          }}
          onBlur={(e) => {
            let newSize: number | null = parseInt(e.target.value);
            if (isNaN(newSize)) {
              newSize = null;
            }
            if (newSize !== value) {
              onChange(newSize);
            }
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
