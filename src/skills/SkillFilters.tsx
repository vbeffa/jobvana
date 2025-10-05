import _ from 'lodash';
import { useMemo, useState } from 'react';
import Button from '../controls/Button';
import Filter from '../inputs/Filter';
import SkillCategorySelect from '../skill_categories/SkillCategorySelect';
import type { SearchFilters } from './useSkills';

const SkillFilters = ({
  filters,
  setShowFilters,
  onChange
}: {
  filters: SearchFilters;
  setShowFilters: (showFilters: boolean) => void;
  onChange: (filters: SearchFilters) => void;
}) => {
  const [newFilters, setNewFilters] = useState<SearchFilters>(filters);

  const isDirty = useMemo(
    () => !_.isEqual(filters, newFilters),
    [filters, newFilters]
  );

  return (
    <div className="absolute border-[0.5px] border-blue-400 rounded-lg w-[80%] h-[600px] left-[10%] top-[156px] bg-white px-2 z-10">
      <div className="p-2">
        <div className="flex flex-row gap-x-4">
          <div className="grid grid-cols-[25%_75%] w-86 gap-y-2">
            <Filter
              id="skill_filter"
              label="Name"
              placeholder="Filter by skill"
              value={newFilters.name}
              onChange={(name) => {
                setNewFilters({ ...newFilters, name });
              }}
              onClear={() => setNewFilters({ ...newFilters, name: '' })}
            />
            <SkillCategorySelect
              skillCategoryId={newFilters.skillCategoryId}
              onChange={(skillCategoryId) => {
                if (!skillCategoryId) {
                  setNewFilters({
                    ...newFilters,
                    skillCategoryId: undefined
                  });
                } else {
                  setNewFilters({ ...newFilters, skillCategoryId });
                }
              }}
            />
            <div className="col-span-2 h-[33px]" />
          </div>
        </div>
      </div>
      <div className="absolute bottom-4 right-4 flex flex-row gap-2">
        <Button
          label="Cancel"
          onClick={() => {
            setShowFilters(false);
          }}
        />
        <Button
          label="Apply"
          disabled={!isDirty}
          onClick={() => {
            onChange(newFilters);
            setShowFilters(false);
          }}
        />
      </div>
    </div>
  );
};

export default SkillFilters;
