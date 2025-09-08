import { Link } from '@tanstack/react-router';
import type { Skill, SkillVersion } from '../hooks/types';

// TODO redo these props, too confusing
export type SkillVersionLinkProps = Pick<Skill, 'skill_category_id' | 'name'> &
  Pick<SkillVersion, 'id' | 'skill_id' | 'version'>;

const SkillVersionLink = ({
  skill_category_id,
  name,
  id: skillVersionId,
  skill_id,
  version
}: SkillVersionLinkProps) => {
  return (
    <Link
      to="/jobvana/skill_categories/$id/skills/$skill_id/skill_versions/$skill_version_id"
      params={{
        id: skill_category_id.toString(),
        skill_id: skill_id.toString(),
        skill_version_id: skillVersionId.toString()
      }}
    >
      {name} {version}
    </Link>
  );
};

export default SkillVersionLink;
