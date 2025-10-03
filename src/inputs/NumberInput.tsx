import { useMemo } from 'react';
import { FaTriangleExclamation } from 'react-icons/fa6';
import Tooltip from './Tooltip';

const NumberInput = ({
  id,
  label,
  value,
  disabled,
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
  disabled?: boolean;
  min: number;
  max: number;
  step?: number;
  showCurrency?: boolean;
  showPercent?: boolean;
  onChange: (value: number | null) => void;
  width?: string;
}) => {
  const outOfRange = useMemo(
    () => value !== null && (value < min || value > max),
    [max, min, value]
  );

  const validRangeMessage = useMemo(() => {
    const formatter = new Intl.NumberFormat('en-US', {
      style: showCurrency ? 'currency' : showPercent ? 'percent' : 'decimal',
      currency: showCurrency ? 'USD' : undefined,
      maximumFractionDigits: 0
    });
    return `Valid range is ${formatter.format(showPercent ? min / 100 : min)} - ${formatter.format(showPercent ? max / 100 : max)}`;
  }, [max, min, showCurrency, showPercent]);

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
          disabled={disabled}
          step={step}
          min={min}
          max={max}
          placeholder={`${min} - ${max}`}
          className={`${showCurrency ? 'pl-4' : ''} ${width} disabled:bg-gray-100 p-1 border-[0.5px] border-gray-500 h-8`}
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
          <Tooltip message={validRangeMessage}>
            <FaTriangleExclamation />
          </Tooltip>
        )}
      </div>
    </>
  );
};

export default NumberInput;
