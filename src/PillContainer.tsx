import type { JSX } from 'react';

const PillContainer = ({
  children
}: {
  children: JSX.Element | Array<JSX.Element>;
}) => {
  return (
    <div className="border-[1px] border-blue-500 bg-blue-200 p-1 w-fit flex gap-1 whitespace-nowrap">
      {children}
    </div>
  );
};

export default PillContainer;
