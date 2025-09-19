import type { HTMLInputAutoCompleteAttribute } from 'react';

export type TextInputProps = {
  id: string;
  label?: string;
  type?: 'text' | 'password';
  value?: string;
  minLength?: number;
  maxLength?: number;
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
  minLength,
  maxLength,
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
      <div className="relative">
        <input
          id={id}
          type={type}
          value={value}
          minLength={minLength}
          maxLength={maxLength}
          placeholder={placeholder}
          disabled={disabled}
          autoComplete={autoComplete}
          className="p-1 pr-14 border-[0.5px] w-full"
          onChange={(e) => onChange(e.target.value)}
        />
        {maxLength && value !== undefined && (
          <div className="absolute text-gray-500 top-[0.6rem] right-2 text-xs">
            {value.length} / {maxLength}
          </div>
        )}
      </div>
    </>
  );
};

export default TextInput;
