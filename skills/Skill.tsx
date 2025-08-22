import "../src/App.css";
import Header from "../src/Header";
import useSkills from "../src/hooks/useSkills";
import SkillVersionLink from "./SkillVersionLink";

function Skill({ id }: { id: number }) {
  const skills = useSkills();
  const skill = skills.skill(id);
  const skillTypes = skills.types;

  if (!skill) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Header />
      <h1>
        {skill.name}
        {skill.abbreviation && ` (${skill.abbreviation})`}
      </h1>
      <h2>Description</h2>
      <div className="card text-left">{skill.description}</div>
      <h2>Skill Type</h2>
      <div className="card text-left">
        {
          skillTypes.find((skillType) => skillType.id === skill.skill_type_id)
            ?.name
        }
      </div>
      <h2>Versions</h2>
      <div className="card text-left">
        {skill.versions.length > 0 && (
          <ul className="list-inside list-disc">
            {skill.versions.map((skillVersion) => (
              <li key={skillVersion.id}>
                <SkillVersionLink skillVersion={skillVersion} />
              </li>
            ))}
          </ul>
        )}
      </div>
      <h2>Notes</h2>
      <div className="card text-left whitespace-pre-wrap">{skill.notes}</div>
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
}

export default Skill;
