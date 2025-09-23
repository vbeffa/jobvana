import { Link } from '@tanstack/react-router';
import PillContainer from '../containers/PillContainer';
import type { Skill } from '../jobs/useJob';

export type SkillLinkProps = {
  skill: Skill;
};

const SkillLink = ({ skill }: { skill: Skill }) => {
  return (
    <PillContainer>
      <Link
        to="/jobvana/skill_categories/$id/skills/$skill_id"
        params={{
          id: skill.skill_category_id.toString(),
          skill_id: skill.id.toString()
        }}
      >
        {skill.name}
      </Link>
    </PillContainer>
  );
};

export default SkillLink;
