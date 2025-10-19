import TextInput from './TextInput';

const Filter = ({
  id,
  label,
  width,
  maxLength,
  placeholder,
  value,
  onChange,
  onClear
}: {
  id: string;
  label?: string;
  width?: string;
  maxLength?: number;
  placeholder: string;
  value?: string;
  onChange: (value: string) => void;
  onClear: () => void;
}) => {
  return (
    <TextInput
      id={id}
      type="text"
      label={label}
      width={width}
      maxLength={maxLength}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      showClear={true}
      onClear={onClear}
    />
  );
};

export default Filter;
