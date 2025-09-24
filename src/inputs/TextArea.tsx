export type TextInputProps = {
  id: string;
  label: string;
  value?: string;
  maxLength?: number;
  rows?: number;
  onChange: (value: string) => void;
};

const TextArea = ({
  id,
  label,
  value,
  maxLength,
  rows = 6,
  onChange
}: TextInputProps) => {
  return (
    <>
      <label htmlFor={id} className="content-start">
        {label}:
      </label>
      <div className="relative">
        <textarea
          id={id}
          value={value}
          maxLength={maxLength}
          className="p-1 border-[0.5px] border-gray-500 min-h-24 w-full"
          onChange={(e) => onChange(e.target.value)}
          rows={rows}
          cols={80}
        />
        {maxLength && value !== undefined && (
          <div className="absolute text-gray-500 bottom-[0.7rem] right-2 text-xs">
            {value.length} / {maxLength}
          </div>
        )}
      </div>
    </>
  );
};

export default TextArea;
