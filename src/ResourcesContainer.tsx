import type { JSX } from 'react';

const ResourcesContainer = ({
  children,
  minWidth
}: {
  children: Array<JSX.Element> | JSX.Element;
  minWidth?: string;
}) => {
  return (
    <div className="flex justify-center">
      <div
        className={`border-[0.5px] border-blue-300 rounded-lg overflow-hidden w-[75%] ${
          minWidth ? minWidth : 'min-w-[1100px]'
        } flex flex-row`}
      >
        {children}
      </div>
    </div>
  );
};

export default ResourcesContainer;
