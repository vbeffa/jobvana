import { Link } from '@tanstack/react-router';
import type { Skill } from '../hooks/types';
import PillContainer from '../PillContainer';

export type SkillLinkProps = {
  skill: Pick<Skill, 'id' | 'skill_category_id' | 'name' | 'abbreviation'>;
  includeAbbrev?: boolean;
};

const SkillLink = ({ skill, includeAbbrev = false }: SkillLinkProps) => {
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
      <>{includeAbbrev && skill.abbreviation && ` (${skill.abbreviation})`}</>
    </PillContainer>
  );
};

export default SkillLink;
