import { Link } from "@tanstack/react-router";
import type { Skill } from "../hooks/useSkills";

const SkillLink = ({ skill }: { skill: Skill }) => {
  return (
    <Link
      to="/jobvana/skill_categories/$id/skills/$skill_id"
      params={{
        id: skill.skill_category_id.toString(),
        skill_id: skill.id.toString()
      }}
    >
      {skill.name}
    </Link>
  );
};

export default SkillLink;
