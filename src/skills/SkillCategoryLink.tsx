import { Link } from "@tanstack/react-router";
import type { SkillCategory } from "../hooks/useSkills";

const SkillCategoryLink = ({ skillType }: { skillType: SkillCategory }) => {
  return (
    <Link
      to="/jobvana/skill_categories/$skill_category_id"
      params={{
        skill_category_id: skillType.id.toString()
      }}
    >
      {skillType.name}
    </Link>
  );
};

export default SkillCategoryLink;
