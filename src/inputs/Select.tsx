import type { ChangeEventHandler, JSX, SelectHTMLAttributes } from 'react';

const Select = ({
  id,
  value,
  disabled,
  children,
  onChange
}: {
  id: string;
  value?: SelectHTMLAttributes<HTMLSelectElement>['value'];
  disabled?: boolean;
  children: JSX.Element | Array<JSX.Element>;
  onChange: ChangeEventHandler<HTMLSelectElement>;
}) => {
  return (
    <select
      id={id}
      className="border-[0.5px] border-gray-500 disabled:bg-gray-100 h-8 py-0.5"
      value={value}
      disabled={disabled}
      onChange={onChange}
    >
      {children}
    </select>
  );
};

export default Select;
