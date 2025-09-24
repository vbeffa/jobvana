import NumberInput from '../../inputs/NumberInput';

const PercentInput = ({
  idx,
  value,
  onChange
}: {
  idx: number;
  value: number;
  onChange: (percent: number) => void;
}) => {
  return (
    <NumberInput
      id={`role_percent_${idx}`}
      value={value}
      min={1}
      max={100}
      showOutOfRange={false}
      onChange={(value) => {
        if (!value) {
          return;
        }
        onChange(value);
      }}
      width="w-18"
    />
  );
};

export default PercentInput;
