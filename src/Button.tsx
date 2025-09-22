export type ButtonProps = {
  label: string;
  disabled?: boolean;
  onClick: () => void;
};

const Button = ({ label, disabled, onClick }: ButtonProps) => {
  return (
    <input
      type="button"
      value={label}
      disabled={disabled}
      className={`border-[0.5px] border-blue-500 h-[33px] ${
        disabled ? 'bg-gray-200' : 'hover:bg-blue-200 cursor-pointer'
      } text-blue-500`}
      onClick={onClick}
    />
  );
};

export default Button;
