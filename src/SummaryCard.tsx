import { useEffect, useRef, type JSX } from 'react';

const SummaryCard = ({
  selected,
  onClick,
  title,
  text,
  last
}: {
  selected: boolean;
  onClick: () => void;
  title: string;
  text: JSX.Element | string;
  last: boolean;
}) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selected) {
      ref.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [selected]);

  return (
    <div
      ref={ref}
      className={`text-left pl-2 py-2 w-full ${
        !last ? 'border-b-[0.5px] border-b-blue-300' : ''
      } ${selected ? (last ? 'bg-gray-200 rounded-bl-lg' : 'bg-gray-200') : ''} cursor-pointer`}
      onClick={onClick}
    >
      <div className="text-blue-500">{title}</div>
      <div className="text-sm">{text}</div>
    </div>
  );
};

export default SummaryCard;
