import { useEffect, useState } from "react";
import supabase from "../src/utils/supabase";

import "../src/App.css";
import type { Database } from "../src/utils/types";
import Header from "../src/Header";

type Skill = Database["public"]["Tables"]["skills"]["Row"] & {
  versions: Array<SkillVersion>;
};

type SkillVersion = Database["public"]["Tables"]["skill_versions"]["Row"];

type SkillType = Database["public"]["Tables"]["skill_types"]["Row"];

function Skills() {
  const [skills, setSkills] = useState<Array<Skill>>([]);
  const [skillTypes, setSkillTypes] = useState<Array<SkillType>>([]);
  const [skillVersions, setSkillVersions] = useState<Array<SkillVersion>>([]);

  useEffect(() => {
    if (
      skills.length > 0 ||
      skillVersions.length === 0 ||
      skillTypes.length === 0
    ) {
      return;
    }
    (async () => {
      const { data } = await supabase.from("skills").select();
      if (data === null) {
        return;
      }
      const skills: Array<Skill> = data.map((skill) => ({
        ...skill,
        versions: skillVersions.filter(
          (skillVersion) => skillVersion.skill_id === skill.id
        )
      }));
      for (const skill of skills) {
        const versionsForSkill = skillVersions.filter(
          (skillVersion) => skillVersion.skill_id === skill.id
        );
        skill.versions = versionsForSkill;
      }
      skills.sort((skill1, skill2) => {
        if (skill1.skill_type_id === skill2.skill_type_id) {
          return skill1.name.localeCompare(skill2.name);
        }
        const skillType1 = skillTypes.find(
          (skillType) => skillType.id === skill1.skill_type_id
        );
        const skillType2 = skillTypes.find(
          (skillType) => skillType.id === skill2.skill_type_id
        );
        return skillType1!.name.localeCompare(skillType2!.name);
      });
      setSkills(skills);
    })();
  }, [skillTypes, skillVersions, skillVersions.length, skills.length]);

  useEffect(() => {
    if (skillTypes.length > 0) {
      return;
    }
    (async () => {
      const { data: skillTypes } = await supabase.from("skill_types").select();
      if (skillTypes === null) {
        return;
      }
      setSkillTypes(skillTypes);
    })();
  }, [skillTypes.length]);

  useEffect(() => {
    if (skillVersions.length > 0) {
      return;
    }
    (async () => {
      const { data: skillVersions } = await supabase
        .from("skill_versions")
        .select();
      if (skillVersions === null) {
        return;
      }
      setSkillVersions(skillVersions);
    })();
  }, [skillVersions.length]);

  if (skills.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Header />
      <h1>Skills</h1>
      <div className="card">
        <table className="border-1 w-full">
          <thead>
            <tr key={0}>
              <th className="p-1 border">Skill</th>
              <th className="p-1 border">Abbreviation</th>
              <th className="p-1 border">Skill Type</th>
              <th className="p-1 border">Description</th>
              <th className="p-1 border">Reference</th>
            </tr>
          </thead>
          <tbody>
            {skills.map((skill) => {
              return (
                <tr key={skill.id}>
                  <td className="p-1 border text-left">
                    {skill.name}
                    {skill.versions.length > 0 && (
                      <ul className="list-inside list-disc">
                        {skill.versions.map((skillVersion) => (
                          <li key={skillVersion.id}>
                            {skillVersion.reference && (
                              <a target="_blank" href={skillVersion.reference}>
                                {skillVersion.version}
                              </a>
                            )}
                            {!skillVersion.reference && skillVersion.version}
                          </li>
                        ))}
                      </ul>
                    )}
                  </td>
                  <td className="p-1 border text-left">{skill.abbreviation}</td>
                  <td className="p-1 border text-left">
                    {
                      skillTypes.find(
                        (skillType) => skillType.id === skill.skill_type_id
                      )?.name
                    }
                  </td>
                  <td className="p-1 border text-left">{skill.description}</td>
                  <td className="p-1 border text-left">
                    {skill.reference && (
                      <a target="_blank" href={skill.reference}>
                        {skill.reference}
                      </a>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default Skills;
