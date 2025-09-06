import type { JSX } from 'react';

export type ResourceDetailsContainerProps = {
  children?: JSX.Element;
};

const ResourceDetailsContainer = ({
  children
}: ResourceDetailsContainerProps) => {
  return (
    <div className="px-4 pt-4 w-[80%] h-[calc(100vh-238px)] overflow-y-auto">
      {children}
    </div>
  );
};

export default ResourceDetailsContainer;
