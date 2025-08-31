import { Link } from '@tanstack/react-router';
import type { DbSkill, SkillVersion } from '../hooks/useSkills';

const SkillVersionLink = ({
  skill,
  skillVersion
}: {
  skill: DbSkill;
  skillVersion: SkillVersion;
}) => {
  return (
    <Link
      to="/jobvana/skill_categories/$id/skills/$skill_id/skill_versions/$skill_version_id"
      params={{
        id: skill.skill_category_id.toString(),
        skill_id: skillVersion.skill_id.toString(),
        skill_version_id: skillVersion.id.toString()
      }}
    >
      {skill.name} {skillVersion.version}
    </Link>
  );
};

export default SkillVersionLink;
