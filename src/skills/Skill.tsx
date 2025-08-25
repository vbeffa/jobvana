import useJobs from "../hooks/useJobs";
import useSkill from "../hooks/useSkill";
import useSkills from "../hooks/useSkills";
import JobsList from "../jobs/JobsList";
import { Route } from "../routes/jobvana.skills.$id.index";
import SkillsList from "./SkillsList";
import SkillVersionsList from "./SkillVersionsList";

const Skill = () => {
  const { id } = Route.useLoaderData();
  const { findSkillType } = useSkills();
  const { skill } = useSkill({ id });
  const { jobsForSkill } = useJobs();

  if (!skill) {
    return null;
  }

  const skillType = findSkillType(skill.skill_category_id);
  if (!skillType) {
    return null;
  }

  const jobs = jobsForSkill(id);

  return (
    <>
      <h1>
        {skill.name}
        {skill.abbreviation && ` (${skill.abbreviation})`}
      </h1>
      <h2>Description</h2>
      <div className="card text-left">{skill.description}</div>
      <h2>Category</h2>
      <div className="card text-left">{skillType.name}</div>
      <h2>Jobs</h2>
      <div className="card text-left">{jobs && <JobsList jobs={jobs} />}</div>
      <h2>Versions</h2>
      <div className="card text-left">
        {skill.versions.length > 0 && (
          <SkillVersionsList skillVersions={skill.versions} />
        )}
      </div>
      <h2>Notes</h2>
      <div className="card text-left whitespace-pre-wrap">{skill.notes}</div>
      <h2>Related Skills</h2>
      <div className="card text-left">
        <SkillsList skills={skill.relatedSkills} />
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
