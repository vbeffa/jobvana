import { Link } from "@tanstack/react-router";
import type { SkillType } from "../hooks/useSkills";

const SkillTypeLink = ({ skillType }: { skillType: SkillType }) => {
  return (
    <Link
      to="/jobvana/skills/skill_types/$skill_type_id"
      params={{
        skill_type_id: skillType.id.toString()
      }}
    >
      {skillType.name}
    </Link>
  );
};

export default SkillTypeLink;
