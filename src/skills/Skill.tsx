import { Link } from "@tanstack/react-router";
import useSkill from "../hooks/useSkill";
import useSkills from "../hooks/useSkills";
import { Route } from "../routes/jobvana.skills.$id.index";

const Skill = () => {
  const { id } = Route.useLoaderData();
  const { findSkillType } = useSkills();
  const { skill } = useSkill({ id });

  if (!skill) {
    return null;
  }

  const skillType = findSkillType(skill.skill_type_id);
  if (!skillType) {
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
      <div className="card text-left">{skillType.name}</div>
      <h2>Versions</h2>
      <div className="card text-left">
        {skill.versions.length > 0 && (
          <ul className="list-inside list-disc">
            {skill.versions.map((skillVersion) => (
              <li key={skillVersion.id}>
                <Link
                  to="/skills/$id/skill_versions/$skill_version_id"
                  params={{
                    id: skill.id.toString(),
                    skill_version_id: skillVersion.id.toString()
                  }}
                >
                  {skillVersion.version}
                </Link>
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
              <Link
                to="/jobvana/skills/$id"
                params={{ id: skill.id.toString() }}
              >
                {skill.name}
              </Link>
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
