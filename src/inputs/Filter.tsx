import TextInput from './TextInput';

const Filter = ({
  id,
  label,
  placeholder,
  value,
  onChange,
  onClear
}: {
  id: string;
  label?: string;
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
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      showClear={true}
      onClear={onClear}
    />
  );
};

export default Filter;
