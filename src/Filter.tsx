const Filter = ({
  id,
  placeholder,
  value,
  onChange,
  onClear
}: {
  id: string;
  placeholder: string;
  value?: string;
  onChange: (value: string) => void;
  onClear: () => void;
}) => {
  return (
    <div className="relative">
      <input
        id={id}
        type="text"
        className="border border-gray-500 rounded-md pl-1 w-full h-8"
        placeholder={placeholder}
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
        }}
      />
      <div
        className="absolute right-1.25 top-0.75 text-gray-400 cursor-pointer"
        onClick={() => {
          onClear();
          document.getElementById(id)?.focus();
        }}
      >
        X
      </div>
    </div>
  );
};

export default Filter;
