import type { JSX } from 'react';

const FiltersContainer = ({ children }: { children?: JSX.Element }) => {
  return <div className="my-4 h-32 flex justify-center">{children}</div>;
};

export default FiltersContainer;
