import { MAX_COMPANY_SIZE, MIN_COMPANY_SIZE } from './useCompanies';

const SizeInput = ({
  elementId,
  size,
  onChange
}: {
  elementId: string;
  size?: number;
  onChange: (size: number) => void;
}) => {
  return (
    <input
      id={elementId}
      type="number"
      step={1}
      min={MIN_COMPANY_SIZE}
      max={MAX_COMPANY_SIZE}
      className="border h-8 pr-1 text-center
                     border-gray-500 rounded-lg"
      value={size}
      onChange={(e) => {
        let minSize = parseInt(e.target.value);
        if (isNaN(minSize) || minSize < MIN_COMPANY_SIZE) {
          minSize = MIN_COMPANY_SIZE;
        }
        onChange(minSize);
      }}
    />
  );
};

export default SizeInput;
