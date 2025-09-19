import type { JSX } from 'react';

const FiltersContainer = ({ children }: { children?: JSX.Element }) => {
  return (
    <div className="flex justify-center mb-2">
      <div className="border-[0.5px] border-blue-300 rounded-lg h-[130px] w-[75%] min-w-[1100px] flex justify-center">
        {children}
      </div>
    </div>
  );
};

export default FiltersContainer;
