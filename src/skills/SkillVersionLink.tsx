import { Link } from '@tanstack/react-router';
import type { Skill, SkillVersion } from '../types';

export type SkillVersionLinkProps = Pick<Skill, 'name'> &
  Pick<SkillVersion, 'id' | 'skill_id' | 'version'>;

const SkillVersionLink = ({
  name,
  id: skillVersionId,
  skill_id,
  version
}: SkillVersionLinkProps) => {
  return (
    <Link
      to="/jobvana/skills/$skill_id/skill_versions/$skill_version_id"
      params={{
        skill_id: skill_id.toString(),
        skill_version_id: skillVersionId.toString()
      }}
    >
      {name} {version}
    </Link>
  );
};

export default SkillVersionLink;
