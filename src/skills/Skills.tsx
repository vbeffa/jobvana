import { useMemo, useState } from "react";
import useJobs from "../hooks/useJobs";
import useSkills from "../hooks/useSkills";
import Loading from "../Loading";
import SkillLink from "./SkillLink";
import SkillCategoryLink from "./SkillCategoryLink";

type SortCol = "skill" | "skill_type" | "num_jobs";
type SortDir = "up" | "down";

const Skills = () => {
  const [sortCol, setSortCol] = useState<SortCol>("num_jobs");
  const [sortDir, setSortDir] = useState<SortDir>("down");
  const [skillsFilter, setSkillsFilter] = useState<string>();
  const [skillCategoriesFilter, setSkillCategoriesFilter] = useState<string>();

  const { skills, findSkillCategory: findSkillCategory } = useSkills();
  const { jobsForSkill } = useJobs();

  const filteredSkills = useMemo(() => {
    return skills
      ?.filter((skill) => {
        let pass = true;
        if (skillsFilter) {
          pass =
            skill.name
              .toLocaleLowerCase()
              .includes(skillsFilter.toLocaleLowerCase()) ||
            (skill.abbreviation !== null &&
              skill.abbreviation
                .toLocaleLowerCase()
                .includes(skillsFilter.toLocaleLowerCase()));
        }
        if (skillCategoriesFilter) {
          const skillCategory = findSkillCategory(
            skill.skill_category_id
          )?.name;
          pass =
            skillCategory !== undefined &&
            skillCategory
              ?.toLocaleLowerCase()
              .includes(skillCategoriesFilter.toLocaleLowerCase());
        }
        return pass;
      })
      .sort((skill1, skill2) => {
        if (sortCol === "skill") {
          return sortDir === "up"
            ? skill1.name.localeCompare(skill2.name)
            : skill2.name.localeCompare(skill1.name);
        }
        if (sortCol === "num_jobs") {
          const numJobs1 = jobsForSkill(skill1.id)!.length;
          const numJobs2 = jobsForSkill(skill2.id)!.length;
          if (numJobs1 === numJobs2) {
            return skill1.name.localeCompare(skill2.name);
          }
          return sortDir === "up" ? numJobs1 - numJobs2 : numJobs2 - numJobs1;
        }
        if (skill1.skill_category_id === skill2.skill_category_id) {
          return skill1.name.localeCompare(skill2.name);
        }
        const skillCategory1 = findSkillCategory(skill1.skill_category_id);
        const skillCategory2 = findSkillCategory(skill2.skill_category_id);
        return sortDir === "up"
          ? skillCategory1!.name.localeCompare(skillCategory2!.name)
          : skillCategory2!.name.localeCompare(skillCategory1!.name);
      });
  }, [
    findSkillCategory,
    jobsForSkill,
    skillCategoriesFilter,
    skills,
    skillsFilter,
    sortCol,
    sortDir
  ]);

  const setSort = (col: SortCol) => {
    const newSortCol = col;
    const newSortDir =
      newSortCol === sortCol
        ? sortDir === "up"
          ? "down"
          : "up"
        : newSortCol === "num_jobs"
          ? "down"
          : "up";
    if (newSortCol === sortCol) {
      setSortDir(newSortDir);
    } else {
      setSortCol(newSortCol);
      setSortDir(newSortDir);
    }
  };

  return (
    <>
      <h1>Skills</h1>
      <div className="card">
        <table className="w-full">
          <thead>
            <tr>
              <td className="text-left pb-2 w-[45%]">
                <input
                  type="text"
                  className="border pl-1"
                  placeholder="Filter by skill"
                  onChange={(e) => {
                    setSkillsFilter(e.target.value);
                  }}
                />
              </td>
              <td className="text-left pb-2" colSpan={2}>
                <input
                  type="text"
                  className="border pl-1"
                  placeholder="Filter by category"
                  onChange={(e) => {
                    setSkillCategoriesFilter(e.target.value);
                  }}
                />
              </td>
            </tr>
            <tr>
              <th
                className="p-1 border cursor-pointer"
                onClick={() => setSort("skill")}
              >
                Skill {sortCol === "skill" && (sortDir === "up" ? "↑" : "↓")}
              </th>
              <th
                className="p-1 border cursor-pointer"
                onClick={() => setSort("skill_type")}
              >
                Category{" "}
                {sortCol === "skill_type" && (sortDir === "up" ? "↑" : "↓")}
              </th>
              <th
                className="p-1 border cursor-pointer w-[10%]"
                onClick={() => setSort("num_jobs")}
              >
                # Jobs{" "}
                {sortCol === "num_jobs" && (sortDir === "up" ? "↑" : "↓")}
              </th>
            </tr>
          </thead>
          <tbody>
            <Loading waitingFor={skills} colSpan={2} />
            {filteredSkills?.map((skill) => {
              const skillCategory = findSkillCategory(skill.skill_category_id);
              return (
                <tr key={skill.id}>
                  <td className="p-1 border text-left">
                    <SkillLink skill={skill} />
                    {skill.abbreviation && ` (${skill.abbreviation})`}
                  </td>
                  <td className="p-1 border text-left">
                    {skillCategory && (
                      <SkillCategoryLink skillCategory={skillCategory} />
                    )}
                  </td>
                  <td className="p-1 border text-left">
                    {jobsForSkill(skill.id)?.length}
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

export default Skills;
