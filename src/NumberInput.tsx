import { useMemo } from 'react';

const NumberInput = ({
  id,
  label,
  size,
  minSize,
  maxSize,
  onChange
}: {
  id: string;
  label?: string;
  size: number | null;
  minSize: number;
  maxSize: number;
  onChange: (size: number | null) => void;
}) => {
  const outOfRange = useMemo(
    () => size !== null && (size < minSize || size > maxSize),
    [maxSize, minSize, size]
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
          min={minSize}
          max={maxSize}
          placeholder={`${minSize} - ${maxSize}`}
          className="p-1 border-[0.5px] border-gray-500 h-8 w-full"
          value={size ?? ''}
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
            if (newSize !== size) {
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
