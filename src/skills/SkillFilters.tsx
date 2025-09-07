import Filter from '../Filter';
import type { SearchFilters } from '../hooks/useSkills';
import SkillCategorySelect from './SkillCategorySelect';

const SkillFilters = ({
  filters,
  setFilters
}: {
  filters: SearchFilters;
  setFilters: React.Dispatch<React.SetStateAction<SearchFilters>>;
}) => {
  return (
    <div className="border-[0.05rem] rounded-lg grid grid-cols-3 gap-2 p-2">
      <div>Name:</div>
      <div className="col-span-2">
        <Filter
          id="skill_filter"
          placeholder="Filter by skill"
          value={filters.name}
          onChange={(name) => {
            setFilters((filters) => ({ ...filters, name }));
          }}
          onClear={() => setFilters((filters) => ({ ...filters, name: '' }))}
        />
      </div>
      <div>Category:</div>
      <div className="col-span-2 flex flex-row gap-x-2">
        <SkillCategorySelect
          id="role"
          skillCategoryId={filters.skillCategoryId}
          onChange={(skillCategoryId) => {
            if (!skillCategoryId) {
              setFilters((filters) => ({
                ...filters,
                skillCategoryId: undefined
              }));
            } else {
              setFilters((filters) => ({ ...filters, skillCategoryId }));
            }
          }}
        />
      </div>
      <div className="col-span-3 h-12" />
    </div>
  );
};

export default SkillFilters;
