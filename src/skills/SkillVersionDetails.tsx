import useSkills from '../hooks/useSkills';
import useSkillVersion from '../hooks/useSkillVersion';

const SkillVersionDetails = ({ id }: { id: number }) => {
  const { findSkill } = useSkills();
  const { skillVersion } = useSkillVersion({ id });
  // const { jobsForSkill } = useJobs();
  if (!skillVersion) {
    return null;
  }
  const skill = findSkill(skillVersion.skill_id);
  if (!skill) {
    return null;
  }

  // TODO this needs a jobsForSkillVersion hook
  // const jobs = jobsForSkill(skillVersion.skill_id);

  return (
    <div className="mx-4 flex flex-col gap-2">
      <h2>
        {skill.name}
        {skill.abbreviation && ` (${skill.abbreviation})`}{' '}
        {skillVersion.version}
      </h2>
      <hr className="my-4 border-gray-400 shadow" />
      <h2>Notes</h2>
      <div className="whitespace-pre-wrap">{skillVersion.notes}</div>
      <hr className="my-4 border-gray-400 shadow" />
      <h2>Released</h2>
      <div>{skillVersion.release_date}</div>
      <hr className="my-4 border-gray-400 shadow" />
      {/* <h2>Jobs</h2>
      <div>{jobs && <JobsList jobs={jobs} />}</div>
      <hr className="my-4 border-gray-400 shadow" /> */}
      <h2>Reference</h2>
      <div>
        {skillVersion.reference && (
          <a target="_blank" href={skillVersion.reference}>
            {skillVersion.reference}
          </a>
        )}
      </div>
    </div>
  );
};

export default SkillVersionDetails;
