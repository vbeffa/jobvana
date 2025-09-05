import useJobs from '../hooks/useJobs';
import useSkill from '../hooks/useSkill';
import useSkills from '../hooks/useSkills';
import JobsList from '../jobs/JobsList';
import SkillCategoryLink from './SkillCategoryLink';
import SkillsList from './SkillsList';
import SkillVersionsList from './SkillVersionsList';

const SkillDetails = ({ id }: { id: number }) => {
  const { findSkillCategory } = useSkills();
  const { skill } = useSkill({ id });
  const { jobsForSkill } = useJobs();

  if (!skill) {
    return null;
  }

  const skillCategory = findSkillCategory(skill.skill_category_id);
  if (!skillCategory) {
    return null;
  }

  const jobs = jobsForSkill(id);

  return (
    <div className="mx-4 flex flex-col gap-2">
      <h1>
        {skill.name}
        {skill.abbreviation && ` (${skill.abbreviation})`}
      </h1>
      <h2>Description</h2>
      <div>{skill.description}</div>
      <h2>Category</h2>
      <div>
        <SkillCategoryLink skillCategory={skillCategory} />
      </div>
      <h2>Jobs</h2>
      <div>{jobs && <JobsList jobs={jobs} />}</div>
      <h2>Versions</h2>
      <div>
        {skill.versions.length > 0 && (
          <SkillVersionsList skillVersions={skill.versions} />
        )}
      </div>
      <h2>Notes</h2>
      <div className="whitespace-pre-wrap">{skill.notes}</div>
      <h2>Related Skills</h2>
      <div>
        <SkillsList skills={skill.relatedSkills} />
      </div>
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
