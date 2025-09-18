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
    <div className="flex flex-row col-span-4 gap-2 relative">
      <TextInput
        id={id}
        type="text"
        label={label}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
      <div
        className="absolute right-1.75 top-1 text-gray-400 cursor-pointer"
        onClick={() => {
          onClear();
          document.getElementById(id)?.focus();
        }}
      >
        {value && 'X'}
      </div>
    </div>
  );
};

export default Filter;
