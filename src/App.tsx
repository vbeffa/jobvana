import { useEffect, useState } from "react";
import supabase from "./utils/supabase";

import "./App.css";

export type User = {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
};

type Skill = {
  id: number;
  name: string;
  abbreviation: string;
  skill_type_id: number;
  description?: string;
  reference?: string;
  versions: Array<SkillVersion>;
};

type SkillVersion = {
  id: number;
  skill_id: number;
  version: string;
  notes: string;
};

type SkillType = {
  id: number;
  name: string;
};

function App() {
  const [skills, setSkills] = useState<Array<Skill>>([]);
  const [skillTypes, setSkillTypes] = useState<Array<SkillType>>([]);
  const [skillVersions, setSkillVersions] = useState<Array<SkillVersion>>([]);

  useEffect(() => {
    if (skills.length > 0 || skillVersions.length === 0) {
      return;
    }
    (async () => {
      const { data: skills } = await supabase
        .from("skills")
        .select()
        .order("name");
      if (skills === null) {
        return;
      }
      for (const skill of skills as Array<Skill>) {
        const versionsForSkill = skillVersions.filter(
          (skillVersion) => skillVersion.skill_id === skill.id
        );
        skill.versions = versionsForSkill;
      }
      setSkills(skills);
    })();
  }, [skillVersions, skillVersions.length, skills.length]);

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

  return (
    <>
      <h1>Skills</h1>
      <div className="card">
        <table className="border-1">
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
                          <li key={skillVersion.id}>{skillVersion.version}</li>
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

export default App;
