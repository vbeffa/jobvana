import { Link } from '@tanstack/react-router';
import type { DbSkill } from '../hooks/useSkills';

const SkillLink = ({
  skill,
  includeAbbrev = false
}: {
  skill: DbSkill;
  includeAbbrev?: boolean;
}) => {
  return (
    <>
      <Link
        to="/jobvana/skill_categories/$id/skills/$skill_id"
        params={{
          id: skill.skill_category_id.toString(),
          skill_id: skill.id.toString()
        }}
      >
        {skill.name}
      </Link>
      {includeAbbrev && skill.abbreviation && ` (${skill.abbreviation})`}
    </>
  );
};

export default SkillLink;
