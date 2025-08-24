import { useMemo, useState } from "react";
import useSkills from "../hooks/useSkills";
import Loading from "../Loading";
import SkillTypeLink from "./SkillTypeLink";

type SortCol = "skill_type";
type SortDir = "up" | "down";

const SkillTypes = () => {
  const [sortCol, setSortCol] = useState<SortCol>("skill_type");
  const [sortDir, setSortDir] = useState<SortDir>("down");
  const [skillTypesFilter, setSkillTypesFilter] = useState<string>();

  const { skillTypes } = useSkills();

  const filteredSkillTypes = useMemo(() => {
    return skillTypes
      ?.filter((skillType) => {
        let pass = true;
        if (skillTypesFilter) {
          pass = skillType.name
            .toLocaleLowerCase()
            .includes(skillTypesFilter.toLocaleLowerCase());
        }
        return pass;
      })
      .sort((skillType1, skillType2) => {
        return sortDir === "down"
          ? skillType1.name.localeCompare(skillType2.name)
          : skillType2.name.localeCompare(skillType1.name);
      });
  }, [skillTypes, skillTypesFilter, sortDir]);

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
      <h1>Skill Categories</h1>
      <div className="card">
        <table className="w-full">
          <thead>
            <tr>
              <td className="text-left pb-2 w-[50%]">
                <input
                  type="text"
                  className="border pl-1"
                  placeholder="Search for skill category"
                  onChange={(e) => {
                    setSkillTypesFilter(e.target.value);
                  }}
                />
              </td>
            </tr>
            <tr>
              <th
                className="p-1 border cursor-pointer"
                onClick={() => setSort("skill_type")}
              >
                Category{" "}
                {sortCol === "skill_type" && (sortDir === "up" ? "↑" : "↓")}
              </th>
            </tr>
          </thead>
          <tbody>
            <Loading waitingFor={skillTypes} colSpan={1} />
            {filteredSkillTypes?.map((skillType) => {
              return (
                <tr key={skillType.id}>
                  <td className="p-1 border text-left">
                    <SkillTypeLink skillType={skillType} />
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

export default SkillTypes;
