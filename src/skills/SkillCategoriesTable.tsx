import { useMemo, useState } from 'react';
import Filter from '../Filter';
import useSkillCategories from '../hooks/useSkillCategories';
import useSkills from '../hooks/useSkills';
import Loading from '../Loading';
import SkillCategoryLink from './SkillCategoryLink';
import SkillsList from './SkillsList';

type SortCol = 'skill_category';
type SortDir = 'up' | 'down';

const SkillCategoriesTable = () => {
  const [sortCol, setSortCol] = useState<SortCol>('skill_category');
  const [sortDir, setSortDir] = useState<SortDir>('up');
  const [categoryFilter, setCategoryFilter] = useState<string>();

  const { findSkills } = useSkills();
  const { skillCategories } = useSkillCategories();

  const filteredSkillCategories = useMemo(() => {
    return skillCategories
      ?.filter((skillCategory) => {
        let pass = true;
        if (categoryFilter) {
          pass = skillCategory.name
            .toLocaleLowerCase()
            .includes(categoryFilter.toLocaleLowerCase());
        }
        return pass;
      })
      .sort((skillCategory1, skillCategory2) => {
        return sortDir === 'up'
          ? skillCategory1.name.localeCompare(skillCategory2.name)
          : skillCategory2.name.localeCompare(skillCategory1.name);
      });
  }, [skillCategories, categoryFilter, sortDir]);

  const setSort = (col: SortCol) => {
    const newSortCol = col;
    const newSortDir =
      newSortCol === sortCol ? (sortDir === 'up' ? 'down' : 'up') : 'up';
    if (newSortCol === sortCol) {
      setSortDir(newSortDir);
    } else {
      setSortCol(newSortCol);
      setSortDir(newSortDir);
    }
  };

  return (
    <table className="w-full">
      <thead>
        <tr>
          <td className="filter" colSpan={2}>
            <div className="w-[25%]">
              <Filter
                id="category_filter"
                placeholder="Filter by skill category"
                value={categoryFilter}
                onChange={setCategoryFilter}
                onClear={() => setCategoryFilter('')}
              />
            </div>
          </td>
        </tr>
        <tr>
          <th
            className="cursor-pointer w-[30%]"
            onClick={() => setSort('skill_category')}
          >
            Category{' '}
            {sortCol === 'skill_category' && (sortDir === 'up' ? '↑' : '↓')}
          </th>
          <th className="w-[70%]">Skills</th>
        </tr>
      </thead>
      <tbody>
        <Loading waitingFor={skillCategories} colSpan={2} />
        {filteredSkillCategories?.map((skillCategory) => {
          const skills = findSkills(skillCategory.id);
          return (
            <tr key={skillCategory.id}>
              <td>
                <SkillCategoryLink {...skillCategory} />
              </td>
              <td>{skills && <SkillsList skills={skills} />}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default SkillCategoriesTable;
