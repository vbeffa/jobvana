import { Link } from "@tanstack/react-router";
import useSkills from "../hooks/useSkills";

const SkillType = ({ skillTypeId }: { skillTypeId: number }) => {
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
            to="/jobvana/skills"
            params={{ parentSkillTypeId: parentSkillType.id }}
          >
            {parentSkillType.name}
          </Link>
        )}
        {!parentSkillType && <>---</>}
      </div>
      <h2>Skill Types</h2>
      <div className="card text-left">
        {childSkillTypes && (
          <ul className="list-inside list-disc">
            {childSkillTypes.map((skillType) => (
              <li key={skillType.id}>
                <Link
                  to="/jobvana/skills"
                  params={{ skillTypeId: skillType.id }}
                >
                  {skillType.name}
                </Link>
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
                <Link
                  to="/jobvana/skills/$id"
                  params={{ id: skill.id.toString() }}
                >
                  {skill.name}
                </Link>
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
