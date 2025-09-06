import { useMemo, useState } from 'react';
import Filter from '../Filter';
import useJobs from '../hooks/useJobs';
import useSkills from '../hooks/useSkills';
import Loading from '../Loading';
import SkillCategoryLink from './SkillCategoryLink';
import SkillLink from './SkillLink';

type SortCol = 'skill' | 'skill_type' | 'num_jobs';
type SortDir = 'up' | 'down';

const SkillsTable = () => {
  const [sortCol, setSortCol] = useState<SortCol>('num_jobs');
  const [sortDir, setSortDir] = useState<SortDir>('down');
  const [skillFilter, setSkillFilter] = useState<string>();
  const [skillCategoryFilter, setSkillCategoryFilter] = useState<string>();

  const { skills, findSkillCategory } = useSkills();
  const { jobsForSkill, isPending } = useJobs();

  const filteredSkills = useMemo(() => {
    if (isPending) {
      return undefined;
    }
    return skills
      ?.filter((skill) => {
        let pass = true;
        if (skillFilter) {
          pass =
            skill.name
              .toLocaleLowerCase()
              .includes(skillFilter.toLocaleLowerCase()) ||
            (skill.abbreviation !== null &&
              skill.abbreviation
                .toLocaleLowerCase()
                .includes(skillFilter.toLocaleLowerCase()));
        }
        if (skillCategoryFilter) {
          const skillCategory = findSkillCategory(
            skill.skill_category_id
          )?.name;
          pass =
            skillCategory !== undefined &&
            skillCategory
              ?.toLocaleLowerCase()
              .includes(skillCategoryFilter.toLocaleLowerCase());
        }
        return pass;
      })
      .sort((skill1, skill2) => {
        if (sortCol === 'skill') {
          return sortDir === 'up'
            ? skill1.name.localeCompare(skill2.name)
            : skill2.name.localeCompare(skill1.name);
        }
        if (sortCol === 'num_jobs') {
          const numJobs1 = jobsForSkill(skill1.id)!.length;
          const numJobs2 = jobsForSkill(skill2.id)!.length;
          if (numJobs1 === numJobs2) {
            return skill1.name.localeCompare(skill2.name);
          }
          return sortDir === 'up' ? numJobs1 - numJobs2 : numJobs2 - numJobs1;
        }
        if (skill1.skill_category_id === skill2.skill_category_id) {
          return skill1.name.localeCompare(skill2.name);
        }
        const skillCategory1 = findSkillCategory(skill1.skill_category_id);
        const skillCategory2 = findSkillCategory(skill2.skill_category_id);
        return sortDir === 'up'
          ? skillCategory1!.name.localeCompare(skillCategory2!.name)
          : skillCategory2!.name.localeCompare(skillCategory1!.name);
      });
  }, [
    isPending,
    skills,
    skillFilter,
    skillCategoryFilter,
    findSkillCategory,
    sortCol,
    sortDir,
    jobsForSkill
  ]);

  const setSort = (col: SortCol) => {
    const newSortCol = col;
    const newSortDir =
      newSortCol === sortCol
        ? sortDir === 'up'
          ? 'down'
          : 'up'
        : newSortCol === 'num_jobs'
          ? 'down'
          : 'up';
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
          <td className="filter">
            <div className="w-[50%]">
              <Filter
                id="skill_filter"
                placeholder="Filter by skill"
                value={skillFilter}
                onChange={setSkillFilter}
                onClear={() => setSkillFilter('')}
              />
            </div>
          </td>
          <td className="filter" colSpan={2}>
            <div className="w-[50%]">
              <Filter
                id="skill_category_filter"
                placeholder="Filter by category"
                value={skillCategoryFilter}
                onChange={setSkillCategoryFilter}
                onClear={() => setSkillCategoryFilter('')}
              />
            </div>
          </td>
        </tr>
        <tr>
          <th
            className="cursor-pointer w-[45%]"
            onClick={() => setSort('skill')}
          >
            Skill {sortCol === 'skill' && (sortDir === 'up' ? '↑' : '↓')}
          </th>
          <th className="cursor-pointer" onClick={() => setSort('skill_type')}>
            Category{' '}
            {sortCol === 'skill_type' && (sortDir === 'up' ? '↑' : '↓')}
          </th>
          <th
            className="cursor-pointer w-[10%]"
            onClick={() => setSort('num_jobs')}
          >
            # Jobs {sortCol === 'num_jobs' && (sortDir === 'up' ? '↑' : '↓')}
          </th>
        </tr>
      </thead>
      <tbody>
        <Loading waitingFor={skills} colSpan={2} />
        {filteredSkills?.map((skill) => {
          const skillCategory = findSkillCategory(skill.skill_category_id);
          return (
            <tr key={skill.id}>
              <td>
                <SkillLink skill={skill} includeAbbrev={true} />
              </td>
              <td>
                {skillCategory && <SkillCategoryLink {...skillCategory} />}
              </td>
              <td>{/* {jobsForSkill(skill.id)?.length} */}-</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default SkillsTable;
