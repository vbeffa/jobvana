import type { SkillVersion } from "../hooks/useSkills";
import Link from "../Link";

const SkillVersionLink = ({
  skillVersion,
  gotoSkillVersion
}: {
  skillVersion: SkillVersion;
  gotoSkillVersion: (skillVersionId: number) => void;
}) => {
  return (
    <Link
      text={`${skillVersion.version}`}
      onClick={() => gotoSkillVersion(skillVersion.id)}
    />
  );
};

export default SkillVersionLink;
