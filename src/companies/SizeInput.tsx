import { MAX_COMPANY_SIZE, MIN_COMPANY_SIZE } from './useCompanies';

const SizeInput = ({
  id,
  label,
  size,
  onChange
}: {
  id: string;
  label?: string;
  size: number | '';
  onChange: (size: number | '') => void;
}) => {
  return (
    <>
      <label htmlFor={id} className="content-center">
        {label}:
      </label>
      <input
        id={id}
        type="number"
        step={1}
        min={MIN_COMPANY_SIZE}
        max={MAX_COMPANY_SIZE}
        placeholder={`${MIN_COMPANY_SIZE} - ${MAX_COMPANY_SIZE}`}
        className="p-1 border-[0.5px] h-8 border-gray-500 col-span-2"
        value={size}
        onChange={(e) => {
          let minSize: number | '' = parseInt(e.target.value);
          if (isNaN(minSize) || minSize < MIN_COMPANY_SIZE) {
            minSize = '';
          }
          onChange(minSize);
        }}
      />
    </>
  );
};

export default SizeInput;
