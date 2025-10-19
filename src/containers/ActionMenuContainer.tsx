import type { JSX } from 'react';

const ActionMenuContainer = ({
  children,
  justify = 'justify-between'
}: {
  children: JSX.Element | Array<JSX.Element | undefined> | undefined;
  justify?: 'justify-between' | 'justify-end';
}) => {
  return (
    <div className="w-full bg-blue-200">
      <div className={`relative pl-4 mr-4 h-7 flex flex-row gap-2 ${justify}`}>
        {children}
      </div>
    </div>
  );
};

export default ActionMenuContainer;
