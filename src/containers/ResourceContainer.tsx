import { type JSX } from 'react';

const ResourceContainer = ({
  children
}: {
  children:
    | Array<JSX.Element | false | null | undefined>
    | JSX.Element
    | false
    | null
    | undefined;
}) => {
  const height = 'h-[calc(100dvh-96px)]'; // see ResourcesContainer

  return (
    <div className="flex justify-center mb-4">
      <div
        className={`border-[0.5px] border-blue-300 ${height} rounded-lg w-[85%] overflow-hidden`}
      >
        {children}
      </div>
    </div>
  );
};

export default ResourceContainer;
