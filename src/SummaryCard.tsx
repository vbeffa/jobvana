import type { JSX } from 'react';

const SummaryCard = ({
  selected,
  onClick,
  title,
  text
}: {
  selected: boolean;
  onClick: () => void;
  title: string;
  text: JSX.Element | string;
}) => {
  return (
    <div
      className={`text-left px-4 py-2 w-fit ${selected ? 'bg-gray-200' : ''} cursor-pointer`}
      onClick={onClick}
    >
      <div className="text-blue-500">{title}</div>
      <div className="text-sm">{text}</div>
    </div>
  );
};

export default SummaryCard;
