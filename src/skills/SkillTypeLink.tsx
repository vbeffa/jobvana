import type { SkillType } from "../hooks/useSkills";
import Link from "../Link";

const SkillTypeLink = ({
  skillType,
  gotoSkillType
}: {
  skillType: SkillType;
  gotoSkillType: (skillTypeId: number) => void;
}) => {
  return (
    <Link text={skillType.name} onClick={() => gotoSkillType(skillType.id)} />
  );
};

export default SkillTypeLink;
