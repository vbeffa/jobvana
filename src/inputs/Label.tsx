const Label = ({
  htmlFor,
  label,
  width = 'w-fit'
}: {
  htmlFor: string;
  label: string;
  width?: string;
}) => {
  return (
    <label htmlFor={htmlFor} className={`${width} content-center`}>
      {label}:
    </label>
  );
};

export default Label;
