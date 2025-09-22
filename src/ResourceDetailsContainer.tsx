import type { JSX } from 'react';

export type ResourceDetailsContainerProps = {
  children?: JSX.Element;
  hasFilters?: boolean;
};

const ResourceDetailsContainer = ({
  children,
  hasFilters = true
}: ResourceDetailsContainerProps) => {
  return (
    <div
      className={`px-4 pt-4 w-[80%] ${hasFilters ? 'h-[calc(100vh-238px)]' : 'h-[calc(100vh-166px)]'} overflow-auto`}
    >
      {children}
    </div>
  );
};

export default ResourceDetailsContainer;
