import Error from '../Error';
import Hr from '../Hr';
import useSkill from './useSkill';
import useSkillVersion from './useSkillVersion';

const SkillVersionDetails = ({
  skillId,
  skillVersionId
}: {
  skillId: number;
  skillVersionId: number;
}) => {
  const { skill, error } = useSkill(skillId);
  const { skillVersion, error: error2 } = useSkillVersion({
    id: skillVersionId
  });
  // const { jobsForSkill } = useJobs();
  if (!skillVersion) {
    return null;
  }
  if (!skill) {
    return null;
  }

  // TODO this needs a jobsForSkillVersion hook
  // const jobs = jobsForSkill(skillVersion.skill_id);

  return (
    <>
      {error && <Error error={error} />}
      {error2 && <Error error={error2} />}
      <h2>
        {skill.name}
        {skill.abbreviation && ` (${skill.abbreviation})`}{' '}
        {skillVersion.version}
      </h2>
      <Hr />
      <h2>Notes</h2>
      <div className="whitespace-pre-wrap">{skillVersion.notes}</div>
      <Hr />
      <h2>Released</h2>
      <div>{skillVersion.release_date}</div>
      <Hr />
      <h2>Jobs</h2>
      {/* <div>{jobs && <JobsList jobs={jobs} />}</div> */}
      <div>TODO</div>
      <Hr />
      <h2>Reference</h2>
      <div>
        {skillVersion.reference && (
          <a target="_blank" href={skillVersion.reference}>
            {skillVersion.reference}
          </a>
        )}
      </div>
    </>
  );
};

export default SkillVersionDetails;
