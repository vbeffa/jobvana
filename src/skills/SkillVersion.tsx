import useSkills from "../hooks/useSkills";
import useSkillVersion from "../hooks/useSkillVersion";

const SkillVersion = ({ versionId }: { versionId: number }) => {
  const { findSkill } = useSkills();
  const { skillVersion } = useSkillVersion({ id: versionId });
  if (!skillVersion) {
    return null;
  }
  const skill = findSkill(skillVersion.skill_id);
  if (!skill) {
    return null;
  }

  return (
    <>
      <h1>
        {skill.name}
        {skill.abbreviation && ` (${skill.abbreviation})`}{" "}
        {skillVersion.version}
      </h1>
      <h2>Notes</h2>
      <div className="card text-left whitespace-pre-wrap">
        {skillVersion.notes}
      </div>
      <h2>Released</h2>
      <div className="card text-left">{skillVersion.release_date}</div>
      <h2>Reference</h2>
      <div className="card text-left">
        {skillVersion.reference && (
          <a target="_blank" href={skillVersion.reference}>
            {skillVersion.reference}
          </a>
        )}
      </div>
    </>
  );
};

export default SkillVersion;
