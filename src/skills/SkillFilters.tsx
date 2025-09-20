import Filter from '../Filter';
import SkillCategorySelect from '../skill_categories/SkillCategorySelect';
import type { SearchFilters } from './useSkills';

const SkillFilters = ({
  filters,
  onChange
}: {
  filters: SearchFilters;
  onChange: (filters: SearchFilters) => void;
}) => {
  return (
    <div className="p-2 w-[24rem]">
      <div className="grid grid-cols-[25%_75%] w-[20rem] gap-y-2">
        <Filter
          id="skill_filter"
          label="Name"
          placeholder="Filter by skill"
          value={filters.name}
          onChange={(name) => {
            onChange({ ...filters, name });
          }}
          onClear={() => onChange({ ...filters, name: '' })}
        />
        <SkillCategorySelect
          skillCategoryId={filters.skillCategoryId}
          onChange={(skillCategoryId) => {
            if (!skillCategoryId) {
              onChange({
                ...filters,
                skillCategoryId: undefined
              });
            } else {
              onChange({ ...filters, skillCategoryId });
            }
          }}
        />
        <div className="col-span-2 h-12" />
      </div>
    </div>
  );
};

export default SkillFilters;
