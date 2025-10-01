const Label = ({
  htmlFor,
  label,
  width = 'w-fit',
  contentAlign = 'content-center'
}: {
  htmlFor: string;
  label: string;
  width?: string;
  contentAlign?: string;
}) => {
  return (
    <label htmlFor={htmlFor} className={`${width} ${contentAlign}`}>
      {label}:
    </label>
  );
};

export default Label;
