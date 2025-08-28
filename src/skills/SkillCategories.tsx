import { useMemo, useState } from 'react';
import useSkills from '../hooks/useSkills';
import Loading from '../Loading';
import SkillCategoryLink from './SkillCategoryLink';
import SkillsList from './SkillsList';
import Filter from '../Filter';

type SortCol = 'skill_category';
type SortDir = 'up' | 'down';

const SkillCategories = () => {
  const [sortCol, setSortCol] = useState<SortCol>('skill_category');
  const [sortDir, setSortDir] = useState<SortDir>('up');
  const [categoryFilter, setCategoryFilter] = useState<string>();

  const { skillCategories, findSkills } = useSkills();

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
    <>
      <h1>Skill Categories</h1>
      <div className="card">
        <table className="w-full">
          <thead>
            <tr>
              <td className="text-left">
                <div className="w-[50%]">
                  <Filter
                    id="category_filter"
                    placeholder="Filter by skill category"
                    value={categoryFilter}
                    onChange={setCategoryFilter}
                    onClear={() => setCategoryFilter('')}
                  />
                </div>
              </td>
              <td></td>
            </tr>
            <tr>
              <td className="h-1" colSpan={3} />
            </tr>
            <tr>
              <th
                className="p-1 border cursor-pointer"
                onClick={() => setSort('skill_category')}
              >
                Category{' '}
                {sortCol === 'skill_category' && (sortDir === 'up' ? '↑' : '↓')}
              </th>
              <th className="p-1 border">Skills</th>
            </tr>
          </thead>
          <tbody>
            <Loading waitingFor={skillCategories} colSpan={1} />
            {filteredSkillCategories?.map((skillCategory) => {
              const skills = findSkills(skillCategory.id);
              return (
                <tr key={skillCategory.id}>
                  <td className="p-1 border text-left align-top">
                    <SkillCategoryLink skillCategory={skillCategory} />
                  </td>
                  <td className="p-1 border text-left">
                    {skills && <SkillsList skills={skills} />}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default SkillCategories;
