import type { JSX } from 'react';

const ApplicationDetailsContainer = ({
  children
}: {
  children: JSX.Element | Array<JSX.Element | null>;
}) => {
  return (
    <div className="flex justify-center mb-4">
      <div className="border-[0.5px] border-blue-400 rounded-lg overflow-hidden w-[75%]">
        <div className="mt-2">
          <div className="mx-4">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationDetailsContainer;
