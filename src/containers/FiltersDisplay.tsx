import { type JSX } from 'react';
import Button from '../controls/Button';
import FiltersContainer from './FiltersContainer';

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
    <FiltersContainer>
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
    </FiltersContainer>
  );
};

export default FiltersDisplay;
