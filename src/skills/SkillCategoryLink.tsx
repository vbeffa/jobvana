import { Link } from '@tanstack/react-router';
import type { SkillCategory } from '../hooks/useSkills';

export type SkillCategoryLinkProps = Pick<SkillCategory, 'id' | 'name'>;

const SkillCategoryLink = ({ id, name }: SkillCategoryLinkProps) => {
  return (
    <Link
      to="/jobvana/skill_categories/$id"
      params={{
        id: id.toString()
      }}
    >
      {name}
    </Link>
  );
};

export default SkillCategoryLink;
