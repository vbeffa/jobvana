import { useEffect, useRef, type JSX } from 'react';

const SummaryCard = ({
  selected,
  onClick,
  title,
  text,
  borderBottom
}: {
  selected: boolean;
  onClick: () => void;
  title: string | JSX.Element;
  text?: JSX.Element | string;
  borderBottom: boolean;
}) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selected) {
      ref.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'nearest'
      });
    }
  }, [selected]);

  return (
    <div
      ref={ref}
      className={`text-left pl-2 py-2 w-full ${
        // TODO border bottom if last card is inside the viewport?
        borderBottom ? 'border-b-[0.5px] border-b-blue-300' : ''
      } ${selected ? 'bg-gray-200' : ''} cursor-pointer`}
      onClick={onClick}
    >
      <div className="text-blue-500">{title}</div>
      <div className="text-sm">{text}</div>
    </div>
  );
};

export default SummaryCard;
