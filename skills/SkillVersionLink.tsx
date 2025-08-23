import "../src/App.css";
import type { Skill, SkillVersion } from "../src/hooks/useSkills";

const SkillVersionLink = ({
  skill,
  skillVersion
}: {
  skill: Skill;
  skillVersion: SkillVersion;
}) => {
  return (
    <a href={`/jobvana/skills/?version_id=${skillVersion.id}`}>
      {skill.name} {skillVersion.version}
    </a>
  );
};

export default SkillVersionLink;
