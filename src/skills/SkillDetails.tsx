import Error from '../Error';
import useSkill from '../hooks/useSkill';
import LoadingModal from '../LoadingModal';
import PillContainer from '../PillContainer';
import SkillCategoryLink from '../skill_categories/SkillCategoryLink';
import SkillsList from './SkillsList';
import SkillVersionsList from './SkillVersionsList';

const SkillDetails = ({ id }: { id: number }) => {
  const { skill, error, isPlaceholderData, isPending } = useSkill(id);

  if (error) {
    return <Error error={error} />;
  }

  if (isPending) {
    return <LoadingModal />;
  }

  if (!skill) {
    return null;
  }

  // const jobs = jobsForSkill(skill.id);

  return (
    <div className="mx-4 flex flex-col gap-2">
      {isPlaceholderData && <LoadingModal />}
      <h2>
        {skill.name}
        {skill.abbreviation && ` (${skill.abbreviation})`}
      </h2>
      <div>{skill.description}</div>
      <hr className="my-4 border-gray-400 shadow" />
      <h2>Category</h2>
      <div>
        <PillContainer>
          <SkillCategoryLink {...skill.category} />
        </PillContainer>
      </div>
      <hr className="my-4 border-gray-400 shadow" />
      {/* <h2>Jobs</h2>
      <div>{jobs && <JobsList jobs={jobs} />}</div>
      <hr className="my-4 border-gray-400 shadow" /> */}
      <h2>Versions</h2>
      <div>
        {skill.versions.length > 0 && (
          <SkillVersionsList skillVersions={skill.versions} skill={skill} />
        )}
      </div>
      <hr className="my-4 border-gray-400 shadow" />
      <h2>Notes</h2>
      <div className="whitespace-pre-wrap">{skill.notes}</div>
      <hr className="my-4 border-gray-400 shadow" />
      {/* <h2>Sibling Skills</h2>
      <div>{siblingSkills && <SkillsList skills={siblingSkills} />}</div>
      <hr className="my-4 border-gray-400 shadow" /> */}
      <h2>Related Skills</h2>
      <div>
        <SkillsList skills={skill.relatedSkills} />
      </div>
      <hr className="my-4 border-gray-400 shadow" />
      <h2>Reference</h2>
      <div>
        {skill.reference && (
          <a target="_blank" href={skill.reference}>
            {skill.reference}
          </a>
        )}
      </div>
    </div>
  );
};

export default SkillDetails;
