import type { JSX } from 'react';

const SummaryCard = ({
  id,
  selected,
  onClick,
  title,
  text
}: {
  id: number;
  selected: boolean;
  onClick: () => void;
  title: string;
  text: JSX.Element | string;
}) => {
  return (
    <div
      key={id}
      className={`text-left px-4 py-2 w-fit ${selected ? 'bg-gray-200' : ''} cursor-pointer`}
      onClick={onClick}
    >
      <div className="text-blue-500">{title}</div>
      <div className="text-sm">{text}</div>
    </div>
  );
};

export default SummaryCard;
