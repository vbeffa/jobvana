import { type JSX } from 'react';
import Button from '../controls/Button';

export const FILTERS_HEIGHT_PX = 61; // 1px for border
export const FILTERS_MARGIN_BOTTOM_PX = 4 * 4;
export const FILTERS_TOTAL_HEIGHT_PX = 77; // FILTERS_HEIGHT_PX + FILTERS_MARGIN_BOTTOM_PX;

const FiltersDisplay = ({
  activeFilters,
  showFilters,
  setShowFilters,
  reset,
  resetDisabled
}: {
  activeFilters: JSX.Element;
  showFilters: boolean;
  setShowFilters: (showFilters: boolean) => void;
  reset: () => void;
  resetDisabled: boolean;
}) => {
  return (
    <div className="flex justify-center h-[60px] mb-4">
      <div className={`border-[0.5px] border-blue-300 rounded-lg w-[85%] flex`}>
        <div className="w-full flex">
          <div className="flex w-fit border-r-[0.5px] h-full border-blue-300 justify-start px-2">
            <div className="content-center">Filters:</div>
          </div>
          <div className="w-full flex overflow-auto justify-start px-2">
            <div className="content-center">{activeFilters}</div>
          </div>
          <div className="flex justify-end pr-2">
            <div className="border-l-[0.5px] border-blue-300 pl-2 flex flex-row gap-2">
              <div className="content-center">
                <Button
                  label="Reset"
                  disabled={resetDisabled || showFilters}
                  onClick={reset}
                />
              </div>
              <div className="content-center">
                <Button
                  label="Edit"
                  disabled={showFilters}
                  onClick={() => setShowFilters(true)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* {showFilters && <>{children}</>} */}
    </div>
  );
};

export default FiltersDisplay;
