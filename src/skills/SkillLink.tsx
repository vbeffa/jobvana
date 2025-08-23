import type { Skill } from "../hooks/useSkills";
import Link from "../Link";

const SkillLink = ({
  skill,
  gotoSkill
}: {
  skill: Skill;
  gotoSkill: (skillId: number) => void;
}) => {
  return (
    <>
      <Link text={skill.name} onClick={() => gotoSkill(skill.id)} />
      {skill.abbreviation && ` (${skill.abbreviation})`}
    </>
  );
};

export default SkillLink;
