import useSkills from "../hooks/useSkills";
import Link from "../Link";
import SkillLink from "./SkillLink";

const SkillType = ({
  skillTypeId,
  gotoSkillType,
  gotoSkill
}: {
  skillTypeId: number;
  gotoSkillType: (skillTypeId: number) => void;
  gotoSkill: (skillId: number) => void;
}) => {
  const { findSkillType, findSkills } = useSkills();
  const skillType = findSkillType(skillTypeId);
  if (!skillType) {
    return null;
  }
  const parentSkillType =
    skillType.parent_skill_type_id &&
    findSkillType(skillType.parent_skill_type_id);
  const skills = findSkills(skillTypeId);

  return (
    <>
      <h1>{skillType.name}</h1>
      <h2>Description</h2>
      <div className="card text-left whitespace-pre-wrap">
        {skillType.description}
      </div>
      <h2>Parent Skill Type</h2>
      <div className="card text-left">
        {parentSkillType && (
          <Link
            text={parentSkillType.name}
            onClick={() => gotoSkillType(parentSkillType.id)}
          />
        )}
        {!parentSkillType && <>---</>}
      </div>
      <h2>Skills</h2>
      <div className="card text-left">
        {skills && (
          <ul className="list-inside list-disc">
            {skills.map((skill) => (
              <li key={skill.id}>
                <SkillLink skill={skill} gotoSkill={gotoSkill} />
              </li>
            ))}
          </ul>
        )}
      </div>
      <h2>Reference</h2>
      <div className="card text-left">
        {skillType.reference && (
          <a target="_blank" href={skillType.reference}>
            {skillType.reference}
          </a>
        )}
      </div>
    </>
  );
};

export default SkillType;
