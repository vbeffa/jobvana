import type { JSX } from 'react';

export type ResourceDetailsContainerProps = {
  children?: JSX.Element;
  padding?: string;
};

const ResourceDetailsContainer = ({
  children,
  padding = 'px-4 pt-4'
}: ResourceDetailsContainerProps) => {
  return <div className={`${padding} w-full overflow-hidden`}>{children}</div>;
};

export default ResourceDetailsContainer;
