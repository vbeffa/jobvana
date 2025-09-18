export type TextInputProps = {
  id: string;
  label: string;
  onChange: (value: string) => void;
};

const TextArea = ({ id, label, onChange }: TextInputProps) => {
  return (
    <>
      <label htmlFor={id} className="content-center">
        {label}:
      </label>
      <textarea
        id={id}
        className="p-1 border-[0.5px] col-span-2"
        onChange={(e) => onChange(e.target.value)}
        rows={3}
        cols={80}
      />
    </>
  );
};

export default TextArea;
