import Filter from '../Filter';
import type { SearchFilters } from '../hooks/useSkills';

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
    </div>
  );
};

export default SkillFilters;
