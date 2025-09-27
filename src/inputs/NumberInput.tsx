import { useMemo, useState } from 'react';
import { FaTriangleExclamation } from 'react-icons/fa6';

const NumberInput = ({
  id,
  label,
  value,
  min,
  max,
  step = 1,
  showCurrency = false,
  showPercent = false,
  onChange,
  width = 'w-full'
}: {
  id: string;
  label?: string;
  value: number | null;
  min: number;
  max: number;
  step?: number;
  showCurrency?: boolean;
  showPercent?: boolean;
  onChange: (value: number | null) => void;
  width?: string;
}) => {
  const [showTooltip, setShowTooltip] = useState(false);
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
      <div className={`relative ${width}`}>
        <input
          id={id}
          type="number"
          step={step}
          min={min}
          max={max}
          placeholder={`${min} - ${max}`}
          className={`${showCurrency ? 'pl-4' : ''} ${width} p-1 border-[0.5px] border-gray-500 h-8`}
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
        {showPercent && value && (
          <div
            className={`absolute ${
              value >= 100 ? 'left-9' : value >= 10 ? 'left-6' : 'left-4'
            } top-1 -z-10`}
          >
            %
          </div>
        )}
        {outOfRange && (
          <div
            className={`absolute text-red-500 top-2 right-6 flex flex-row gap-1`}
            onMouseOver={() => setShowTooltip(true)}
            onMouseOut={() => setShowTooltip(false)}
          >
            <FaTriangleExclamation />
            {showTooltip && (
              <div className="absolute size-64 top-3 left-5 z-10">
                <div className="size-fit text-sm border-[0.5px] border-gray-600 rounded-sm text-gray-600 bg-gray-200 p-1">
                  Valid range is {showCurrency && '$'}
                  {min} - {showCurrency && '$'}
                  {max}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default NumberInput;
