import type { JSX } from 'react';

const ResourceListContainer = ({
  children,
  width = 'w-[30%]'
}: {
  children: JSX.Element | Array<JSX.Element>;
  width?: string;
}) => {
  return (
    <div className={`border-r-[0.5px] border-r-blue-300 ${width} min-w-38`}>
      {children}
    </div>
  );
};

export default ResourceListContainer;
