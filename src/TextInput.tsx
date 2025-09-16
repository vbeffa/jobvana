import type { HTMLInputAutoCompleteAttribute } from 'react';

export type TextInputProps = {
  id: string;
  label: string;
  type?: 'text' | 'password';
  disabled?: boolean;
  autoComplete?: HTMLInputAutoCompleteAttribute;
  onChange: (value: string) => void;
};

const TextInput = ({
  id,
  label,
  type = 'text',
  disabled,
  autoComplete,
  onChange
}: TextInputProps) => {
  return (
    <>
      <label htmlFor={id} className="content-center">
        {label}:
      </label>
      <input
        id={id}
        type={type}
        disabled={disabled}
        autoComplete={autoComplete}
        className="p-1 border-[0.5px] col-span-2"
        onChange={(e) => onChange(e.target.value)}
      />
    </>
  );
};

export default TextInput;
