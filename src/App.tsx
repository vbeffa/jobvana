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
  notes?: string;
  parent_skill_id?: number;
};

type SkillType = {
  id: number;
  name: string;
};

function App() {
  const [skills, setSkills] = useState<Array<Skill>>([]);
  const [skillTypes, setSkillTypes] = useState<Array<SkillType>>([]);

  useEffect(() => {
    if (skills.length > 0) {
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
      setSkills(skills);
    })();
  }, [skills.length]);

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
              <th className="p-1 border">Notes</th>
              <th className="p-1 border">Parent Skill</th>
            </tr>
          </thead>
          <tbody>
            {skills.map((skill) => {
              return (
                <tr key={skill.id}>
                  <td className="p-1 border text-left">{skill.name}</td>
                  <td className="p-1 border text-left">{skill.abbreviation}</td>
                  <td className="p-1 border text-left">
                    {
                      skillTypes.find(
                        (skillType) => skillType.id === skill.skill_type_id
                      )?.name
                    }
                  </td>
                  <td className="p-1 border text-left">{skill.notes}</td>
                  <td className="p-1 border text-left">
                    {skills.find((s) => s.id === skill.parent_skill_id)?.name}
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
