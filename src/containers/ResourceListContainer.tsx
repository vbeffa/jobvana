import type { JSX } from 'react';

const ResourceListContainer = ({
  children
}: {
  children: JSX.Element | Array<JSX.Element>;
}) => {
  return (
    <div className="border-r-[0.5px] border-r-blue-300 w-[25%] min-w-38 max-w-48">
      {children}
    </div>
  );
};

export default ResourceListContainer;
