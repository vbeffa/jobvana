import type { JSX } from 'react';

const ActionMenuContainer = ({
  children,
  justify = 'justify-between'
}: {
  children: JSX.Element | Array<JSX.Element | undefined> | undefined;
  justify?: 'justify-between' | 'justify-end';
}) => {
  return (
    <div className="sticky top-0 z-999 bg-blue-300 text-blue-500">
      {/* need relative for EditDeleteIcons */}
      <div className={`relative mx-4 h-7 flex flex-row gap-2 ${justify}`}>
        {children}
      </div>
    </div>
  );
};

export default ActionMenuContainer;
