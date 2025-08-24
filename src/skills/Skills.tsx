import { Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import useSkills from "../hooks/useSkills";
import Loading from "../Loading";

type SortCol = "skill" | "skill_type";
type SortDir = "up" | "down";

const Skills = () => {
  const [sortCol, setSortCol] = useState<SortCol>("skill_type");
  const [sortDir, setSortDir] = useState<SortDir>("down");
  const [skillsFilter, setSkillsFilter] = useState<string>();
  const [skillTypesFilter, setSkillTypesFilter] = useState<string>();

  const { skills, findSkillType } = useSkills();
  // const skillTypes = skills.skillTypes;

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
        if (skillTypesFilter) {
          const skillType = findSkillType(skill.skill_type_id)?.name;
          pass =
            skillType !== undefined &&
            skillType
              ?.toLocaleLowerCase()
              .includes(skillTypesFilter.toLocaleLowerCase());
        }
        return pass;
      })
      .sort((skill1, skill2) => {
        if (sortCol === "skill") {
          return sortDir === "down"
            ? skill1.name.localeCompare(skill2.name)
            : skill2.name.localeCompare(skill1.name);
        }
        if (skill1.skill_type_id === skill2.skill_type_id) {
          return skill1.name.localeCompare(skill2.name);
        }
        const skillType1 = findSkillType(skill1.skill_type_id);
        const skillType2 = findSkillType(skill2.skill_type_id);
        return sortDir === "down"
          ? skillType1!.name.localeCompare(skillType2!.name)
          : skillType2!.name.localeCompare(skillType1!.name);
      });
  }, [findSkillType, skillTypesFilter, skills, skillsFilter, sortCol, sortDir]);

  const setSort = (col: SortCol) => {
    const newSortCol = col;
    const newSortDir =
      newSortCol === sortCol ? (sortDir === "up" ? "down" : "up") : "down";
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
              <td className="text-left pb-2 w-[50%]">
                <input
                  type="text"
                  className="border pl-1"
                  placeholder="Search for skill"
                  onChange={(e) => {
                    setSkillsFilter(e.target.value);
                  }}
                />
              </td>
              <td className="text-left pb-2">
                <input
                  type="text"
                  className="border pl-1"
                  placeholder="Filter by skill type"
                  onChange={(e) => {
                    setSkillTypesFilter(e.target.value);
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
                Skill Type{" "}
                {sortCol === "skill_type" && (sortDir === "up" ? "↑" : "↓")}
              </th>
            </tr>
          </thead>
          <tbody>
            <Loading waitingFor={skills} colSpan={2} />
            {filteredSkills?.map((skill) => {
              const skillType = findSkillType(skill.skill_type_id);
              return (
                <tr key={skill.id}>
                  <td className="p-1 border text-left">
                    <Link
                      to="/jobvana/skills/$id"
                      params={{ id: skill.id.toString() }}
                    >
                      {skill.name}
                    </Link>
                    {skill.abbreviation && ` (${skill.abbreviation})`}
                  </td>
                  <td className="p-1 border text-left">{skillType?.name}</td>
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
