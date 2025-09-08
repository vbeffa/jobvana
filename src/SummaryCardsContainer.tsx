import type { JSX } from 'react';

const SummaryCardsContainer = ({
  children,
  hasFilters = true
}: {
  children?: Array<JSX.Element>;
  hasFilters?: boolean;
}) => {
  return (
    <div
      className={`${hasFilters ? 'h-[calc(100dvh-300px)]' : 'h-[calc(100dvh-166px)]'} overflow-y-auto`}
    >
      {children}
    </div>
  );
};

export default SummaryCardsContainer;
