import type { JSX } from 'react';

export type ResourceDetailsContainerProps = {
  children?: JSX.Element;
};

const ResourceDetailsContainer = ({
  children
}: ResourceDetailsContainerProps) => {
  return <div className={`px-4 pt-4 w-full overflow-auto`}>{children}</div>;
};

export default ResourceDetailsContainer;
