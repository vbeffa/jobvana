import { Link } from '@tanstack/react-router';
import type { Skill } from '../jobs/useJob';

const SkillLink = ({ skill }: { skill: Skill }) => {
  return (
    <Link
      to="/jobvana/skill_categories/$id/skills/$skill_id"
      target="_blank"
      params={{
        id: skill.skill_category_id.toString(),
        skill_id: skill.id.toString()
      }}
    >
      {skill.abbreviation ?? skill.name}
    </Link>
  );
};

export default SkillLink;
