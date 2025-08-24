import useSkills from "../hooks/useSkills";
import Link from "../Link";
import SkillLink from "./SkillLink";
import SkillTypeLink from "./SkillTypeLink";

const SkillType = ({
  skillTypeId,
  gotoSkillType,
  gotoSkill
}: {
  skillTypeId: number;
  gotoSkillType: (skillTypeId: number) => void;
  gotoSkill: (skillId: number) => void;
}) => {
  const { findSkillType, findSkills, findChildSkillTypes } = useSkills();
  const skillType = findSkillType(skillTypeId);
  if (!skillType) {
    return null;
  }
  const parentSkillType =
    skillType.parent_skill_type_id &&
    findSkillType(skillType.parent_skill_type_id);
  const skills = findSkills(skillTypeId);
  const childSkillTypes = findChildSkillTypes(skillType.id);

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
      <h2>Skill Types</h2>
      <div className="card text-left">
        {childSkillTypes && (
          <ul className="list-inside list-disc">
            {childSkillTypes.map((skillType) => (
              <li key={skillType.id}>
                <SkillTypeLink
                  skillType={skillType}
                  gotoSkillType={gotoSkillType}
                />
              </li>
            ))}
          </ul>
        )}
        {!childSkillTypes && <>---</>}
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
      <h2>Notes</h2>
      <div className="card text-left whitespace-pre-wrap">
        {skillType.notes}
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
