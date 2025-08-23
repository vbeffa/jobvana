import type { Skill, SkillVersion } from "../hooks/useSkills";
import Link from "../Link";

const SkillVersionLink = ({
  skill,
  skillVersion,
  gotoSkillVersion
}: {
  skill: Skill;
  skillVersion: SkillVersion;
  gotoSkillVersion: (skillVersionId: number) => void;
}) => {
  return (
    <Link
      text={`${skill.name} ${skillVersion.version}`}
      onClick={() => gotoSkillVersion(skillVersion.id)}
    />
  );
};

export default SkillVersionLink;
