import type { HTMLInputAutoCompleteAttribute } from 'react';
import { FaEye, FaEyeSlash, FaX } from 'react-icons/fa6';

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
  showLength?: boolean;
  showClear?: boolean;
  showEye?: boolean;
  onChange: (value: string) => void;
  onClear?: () => void;
  onClickEye?: () => void;
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
  showLength = true,
  showClear,
  showEye,
  onChange,
  onClear,
  onClickEye
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
          className={`p-1 ${
            maxLength && showEye
              ? 'pr-18'
              : maxLength
                ? 'pr-14'
                : showEye
                  ? 'pr-7'
                  : ''
          } border-[0.5px] border-gray-500 w-full`}
          onChange={(e) => onChange(e.target.value)}
        />
        {showLength && maxLength && value !== undefined && (
          <div
            className={`absolute text-gray-500 top-[0.525rem] ${showEye ? 'right-7' : 'right-2'} text-xs`}
          >
            {value.length} / {maxLength}
          </div>
        )}
        {showClear && onClear && (
          <div
            className="absolute right-[0.45rem] top-[0.525rem] text-gray-400 cursor-pointer"
            onClick={() => {
              onClear();
              document.getElementById(id)?.focus();
            }}
          >
            {value && <FaX />}
          </div>
        )}
        {showEye && onClickEye && (
          <div
            className="absolute right-[0.45rem] top-[0.525rem] text-gray-400 cursor-pointer"
            onClick={() => {
              onClickEye();
              document.getElementById(id)?.focus();
            }}
          >
            {value && (type === 'password' ? <FaEye /> : <FaEyeSlash />)}
          </div>
        )}
      </div>
    </>
  );
};

export default TextInput;
