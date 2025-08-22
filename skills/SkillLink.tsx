import "../src/App.css";
import type { Skill } from "../src/hooks/useSkills";

function SkillLink({ skill }: { skill: Skill }) {
  return (
    <>
      <a href={`/jobvana/skills/?id=${skill.id}`}>{skill.name}</a>
      {skill.abbreviation && ` (${skill.abbreviation})`}
    </>
  );
}

export default SkillLink;
