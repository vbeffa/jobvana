import type { JSX } from 'react';
import Button from './controls/Button';

export const FILTERS_HEIGHT_PX = 131;
export const FILTERS_MARGIN_BOTTOM = 4;
export const FILTERS_TOTAL_HEIGHT_PX =
  FILTERS_HEIGHT_PX + 4 * FILTERS_MARGIN_BOTTOM;

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
    <div
      className={`flex justify-center h-[${FILTERS_HEIGHT_PX}px] mb-${FILTERS_MARGIN_BOTTOM}`}
    >
      <div
        className={`border-[0.5px] border-blue-300 rounded-lg w-[75%] min-w-[1100px] flex justify-start relative`}
      >
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
