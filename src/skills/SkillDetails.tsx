import PillContainer from '../containers/PillContainer';
import JobvanaError from '../JobvanaError';
import LoadingModal from '../LoadingModal';
import Section from '../Section';
import SkillCategoryLink from '../skill_categories/SkillCategoryLink';
import SkillsList from './SkillsList';
import SkillVersionsList from './SkillVersionsList';
import useSkill from './useSkill';

const SkillDetails = ({ id }: { id: number }) => {
  const { skill, error, isPlaceholderData, isPending } = useSkill(id);

  if (error) {
    return <JobvanaError error={error} />;
  }

  if (isPending) {
    return <LoadingModal />;
  }

  if (!skill) {
    return null;
  }

  // const jobs = jobsForSkill(skill.id);

  return (
    <>
      {isPlaceholderData && <LoadingModal />}
      <Section
        title={
          <>
            {skill.name}
            {skill.abbreviation && ` (${skill.abbreviation})`}
          </>
        }
      >
        {skill.description}
      </Section>
      <Section title="Category">
        <div className="mt-2">
          <PillContainer>
            <SkillCategoryLink {...skill.category} />
          </PillContainer>
        </div>
      </Section>
      {/* <h2>Jobs</h2>
      <div>{jobs && <JobsList jobs={jobs} />}</div>
      */}
      <Section title="Versions">
        {skill.versions.length > 0 ? (
          <SkillVersionsList skillVersions={skill.versions} skill={skill} />
        ) : null}
      </Section>
      <Section title="Notes">{skill.notes}</Section>
      {/* <h2>Sibling Skills</h2>
      <div>{siblingSkills && <SkillsList skills={siblingSkills} />}</div>
      */}
      <Section title="Related Skills">
        <SkillsList skills={skill.relatedSkills} />
      </Section>
      <Section title="Reference" isLast={true}>
        {skill.reference && (
          <a target="_blank" href={skill.reference}>
            {skill.reference}
          </a>
        )}
      </Section>
    </>
  );
};

export default SkillDetails;
