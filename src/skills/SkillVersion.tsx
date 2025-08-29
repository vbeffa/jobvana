import useJobs from '../hooks/useJobs';
import useSkills from '../hooks/useSkills';
import useSkillVersion from '../hooks/useSkillVersion';
import JobsList from '../jobs/JobsList';
import { Route } from '../routes/jobvana.skill_categories.$id.skills.$skill_id.skill_versions.$skill_version_id';

const SkillVersion = () => {
  const { skillVersionId } = Route.useLoaderData();
  const { findSkill } = useSkills();
  const { skillVersion } = useSkillVersion({ id: skillVersionId });
  const { jobsForSkill } = useJobs();
  if (!skillVersion) {
    return null;
  }
  const skill = findSkill(skillVersion.skill_id);
  if (!skill) {
    return null;
  }

  const jobs = jobsForSkill(skillVersion.skill_id);

  return (
    <>
      <h1>
        {skill.name}
        {skill.abbreviation && ` (${skill.abbreviation})`}{' '}
        {skillVersion.version}
      </h1>
      <h2>Notes</h2>
      <div className="card text-left whitespace-pre-wrap">
        {skillVersion.notes}
      </div>
      <h2>Released</h2>
      <div className="card text-left">{skillVersion.release_date}</div>
      <h2>Jobs</h2>
      <div className="card text-left">{jobs && <JobsList jobs={jobs} />}</div>

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
