import type { JSX } from 'react';
import Button from './Button';

const FiltersContainer = ({
  children,
  reset,
  resetDisabled
}: {
  children?: JSX.Element;
  reset: () => void;
  resetDisabled: boolean;
}) => {
  return (
    <div className="flex justify-center mb-2">
      <div className="border-[0.5px] border-blue-300 rounded-lg h-[130px] w-[75%] min-w-[1100px] flex justify-start relative">
        <>
          {children}
          <div className="absolute top-2 right-2">
            <Button label="Reset" disabled={resetDisabled} onClick={reset} />
          </div>
        </>
      </div>
    </div>
  );
};

export default FiltersContainer;
