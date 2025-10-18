import type { JSX } from 'react';

const FiltersContainer = ({
  children
}: {
  children: JSX.Element | Array<JSX.Element>;
}) => {
  return (
    <div className="flex justify-center h-[60px] mb-4">
      <div className={`border-[0.5px] border-blue-300 rounded-lg w-[85%] flex`}>
        <div className="w-full flex">
          <div className="flex w-fit border-r-[0.5px] h-full border-blue-300 justify-start px-2">
            <div className="content-center">Filters:</div>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
};

export default FiltersContainer;
