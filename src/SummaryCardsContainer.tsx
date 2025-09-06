import type { JSX } from 'react';

const SummaryCardsContainer = ({
  children
}: {
  children?: Array<JSX.Element>;
}) => {
  return (
    <div className="h-[calc(100dvh-300px)] overflow-y-auto">{children}</div>
  );
};

export default SummaryCardsContainer;
