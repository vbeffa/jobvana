import type { HTMLInputAutoCompleteAttribute } from 'react';

export type TextInputProps = {
  id: string;
  label?: string;
  type?: 'text' | 'password';
  value?: string;
  placeholder?: string;
  disabled?: boolean;
  autoComplete?: HTMLInputAutoCompleteAttribute;
  onChange: (value: string) => void;
};

const TextInput = ({
  id,
  label,
  type = 'text',
  value,
  placeholder,
  disabled,
  autoComplete,
  onChange
}: TextInputProps) => {
  return (
    <>
      {label && (
        <label htmlFor={id} className="content-center">
          {label}:
        </label>
      )}
      <input
        id={id}
        type={type}
        value={value}
        placeholder={placeholder}
        disabled={disabled}
        autoComplete={autoComplete}
        className="p-1 border-[0.5px] w-full col-span-3"
        onChange={(e) => onChange(e.target.value)}
      />
    </>
  );
};

export default TextInput;
