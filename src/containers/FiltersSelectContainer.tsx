import type { JSX } from 'react';

const FiltersSelectContainer = ({
  children
}: {
  children: Array<JSX.Element | false | undefined>;
}) => {
  return (
    <div className="absolute overflow-auto border-[0.5px] border-blue-400 rounded-lg w-[80%] h-[calc(100dvh-228px)] left-[10%] top-[180px] opacity-95 bg-white px-2 z-10">
      {children}
    </div>
  );
};

export default FiltersSelectContainer;
