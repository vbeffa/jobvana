import { type JSX } from 'react';
import Button from '../controls/Button';

export const FILTERS_HEIGHT_PX = 61; // 1px for border
export const FILTERS_MARGIN_BOTTOM_PX = 4 * 4;
export const FILTERS_TOTAL_HEIGHT_PX = 77; // FILTERS_HEIGHT_PX + FILTERS_MARGIN_BOTTOM_PX;

const FiltersContainer = ({
  activeFilters,
  children,
  showFilters,
  setShowFilters,
  reset,
  resetDisabled
}: {
  activeFilters: JSX.Element;
  children?: JSX.Element;
  showFilters: boolean;
  setShowFilters: (showFilters: boolean) => void;
  reset: () => void;
  resetDisabled: boolean;
}) => {
  return (
    <div className="flex justify-center h-[60px] mb-4">
      <div
        className={`border-[0.5px] border-blue-300 rounded-lg p-2 w-[1400px] flex justify-start relative`}
      >
        <div className="w-full flex justify-between">
          <div className="flex flex-row gap-2">
            <div className="content-center whitespace-nowrap">
              Active Filters:
            </div>
            <div className="w-0.5 -my-2 border-r-[0.5px] border-blue-300"></div>
            <div className="w-[1160px] content-center">{activeFilters}</div>
          </div>
          <div className="flex flex-row gap-2 items-center">
            <Button
              label="Reset"
              disabled={resetDisabled || showFilters}
              onClick={reset}
            />
            <Button
              label="Edit"
              disabled={showFilters}
              onClick={() => setShowFilters(true)}
            />
          </div>
        </div>
      </div>
      {showFilters && <>{children}</>}
    </div>
  );
};

export default FiltersContainer;
