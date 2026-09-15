import { Link } from '@tanstack/react-router';
import type { Skill } from '../jobs/job_seekers/useJob';

export type SkillLinkProps = {
  skill: Skill;
};

const SkillLink = ({ skill }: SkillLinkProps) => {
  return (
    <Link
      to="/jobvana/skills/$skill_id"
      params={{
        skill_id: skill.id.toString()
      }}
    >
      {skill.abbreviation ?? skill.name}
    </Link>
  );
};

export default SkillLink;
