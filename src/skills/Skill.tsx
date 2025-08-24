import useSkill from "../hooks/useSkill";
import useSkills from "../hooks/useSkills";
import SkillLink from "./SkillLink";
import SkillVersionLink from "./SkillVersionLink";

const Skill = ({
  id,
  gotoSkill,
  gotoSkillVersion
}: {
  id: number;
  gotoSkill: (skillId: number) => void;
  gotoSkillVersion: (skillVersionId: number) => void;
}) => {
  const { skillTypes } = useSkills();
  const { skill } = useSkill({ id });

  if (!skill) {
    return null;
  }

  return (
    <>
      <h1>
        {skill.name}
        {skill.abbreviation && ` (${skill.abbreviation})`}
      </h1>
      <h2>Description</h2>
      <div className="card text-left">{skill.description}</div>
      <h2>Skill Type</h2>
      <div className="card text-left">
        {
          skillTypes?.find((skillType) => skillType.id === skill.skill_type_id)
            ?.name
        }
      </div>
      <h2>Versions</h2>
      <div className="card text-left">
        {skill.versions.length > 0 && (
          <ul className="list-inside list-disc">
            {skill.versions.map((skillVersion) => (
              <li key={skillVersion.id}>
                <SkillVersionLink
                  skillVersion={skillVersion}
                  gotoSkillVersion={gotoSkillVersion}
                />
              </li>
            ))}
          </ul>
        )}
      </div>
      <h2>Notes</h2>
      <div className="card text-left whitespace-pre-wrap">{skill.notes}</div>
      <h2>Related Skills</h2>
      <div className="card text-left">
        <ul className="list-inside list-disc">
          {skill.relatedSkills.map((skill) => (
            <li key={skill.id}>
              <SkillLink skill={skill} gotoSkill={gotoSkill} />
            </li>
          ))}
        </ul>
      </div>
      <h2>Reference</h2>
      <div className="card text-left">
        {skill.reference && (
          <a target="_blank" href={skill.reference}>
            {skill.reference}
          </a>
        )}
      </div>
    </>
  );
};

export default Skill;
