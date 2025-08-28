import { Link } from '@tanstack/react-router';
import type { SkillCategory } from '../hooks/useSkills';

const SkillCategoryLink = ({
  skillCategory
}: {
  skillCategory: SkillCategory;
}) => {
  return (
    <Link
      to="/jobvana/skill_categories/$id"
      params={{
        id: skillCategory.id.toString()
      }}
    >
      {skillCategory.name}
    </Link>
  );
};

export default SkillCategoryLink;
