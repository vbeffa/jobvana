import "../src/App.css";
import Header from "../src/Header";
import useSkills from "../src/hooks/useSkills";

const SkillVersion = ({ versionId }: { versionId: number }) => {
  const skills = useSkills();
  const skillVersion = skills.version(versionId);
  if (!skillVersion) {
    return null;
  }
  const skill = skills.skill(skillVersion.skill_id);

  if (!skill || !skillVersion) {
    return (
      <div>
        <Header currPage="skill_version" />
        Loading...
      </div>
    );
  }

  return (
    <>
      <Header currPage="skill_version" />
      <h1>
        {skill.name}
        {skill.abbreviation && ` (${skill.abbreviation})`} -{" "}
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
