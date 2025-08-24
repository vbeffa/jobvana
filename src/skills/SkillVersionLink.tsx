import { Link } from "@tanstack/react-router";
import type { Skill, SkillVersion } from "../hooks/useSkills";

const SkillVersionLink = ({
  skill,
  skillVersion
}: {
  skill: Skill;
  skillVersion: SkillVersion;
}) => {
  return (
    <Link
      to="/jobvana/skills/$id/skill_versions/$skill_version_id"
      params={{
        id: skillVersion.skill_id.toString(),
        skill_version_id: skillVersion.id.toString()
      }}
    >
      {skill.name} {skillVersion.version}
    </Link>
  );
};

export default SkillVersionLink;
