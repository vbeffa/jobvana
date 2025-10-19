import type { HTMLInputAutoCompleteAttribute } from 'react';
import { FaEye, FaEyeSlash, FaX } from 'react-icons/fa6';

export type TextInputProps = {
  id: string;
  label?: string;
  type?: 'text' | 'password';
  value?: string;
  width?: string;
  minLength?: number;
  maxLength?: number;
  placeholder?: string;
  disabled?: boolean;
  size?: 'sm' | 'reg';
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
  width = 'w-full',
  minLength,
  maxLength,
  placeholder,
  disabled,
  size = 'reg',
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
      <div className={`relative ${width}`}>
        <input
          id={id}
          type={type}
          value={value}
          minLength={minLength}
          maxLength={maxLength}
          placeholder={placeholder}
          disabled={disabled}
          autoComplete={autoComplete}
          className={`p-1 ${width} ${
            maxLength && (showEye || showClear)
              ? 'pr-18'
              : maxLength
                ? 'pr-14'
                : showEye
                  ? 'pr-7'
                  : ''
          } border-[0.5px] border-gray-500 ${size === 'sm' && 'h-6'}`}
          onChange={(e) => onChange(e.target.value)}
        />
        {showLength && maxLength && value !== undefined && (
          <div
            className={`absolute text-gray-500 top-[0.525rem] ${(showEye || showClear) && value ? 'right-7' : 'right-2'} text-xs`}
          >
            {value.length} / {maxLength}
          </div>
        )}
        {showClear && onClear && (
          <div
            className={`absolute right-[0.45rem] ${size === 'sm' ? 'text-sm top-[0.3rem]' : 'top-[0.525rem]'} text-gray-400 hover:text-gray-300 cursor-pointer`}
            onClick={() => {
              onClear();
              document.getElementById(id)?.focus();
            }}
          >
            {value && <FaX />}
          </div>
        )}
        {showEye && onClickEye && value && (
          <div
            className="absolute right-[0.45rem] top-[0.525rem] text-gray-400 cursor-pointer"
            onClick={() => {
              onClickEye();
              document.getElementById(id)?.focus();
            }}
          >
            {type === 'password' ? <FaEye /> : <FaEyeSlash />}
          </div>
        )}
      </div>
    </>
  );
};

export default TextInput;
