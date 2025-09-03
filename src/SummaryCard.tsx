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
      className={`text-left pl-2 py-2 w-full border-b-[0.5px] border-b-blue-300 ${selected ? 'bg-gray-200' : ''} cursor-pointer`}
      onClick={onClick}
    >
      <div className="text-blue-500">{title}</div>
      <div className="text-sm">{text}</div>
    </div>
  );
};

export default SummaryCard;
