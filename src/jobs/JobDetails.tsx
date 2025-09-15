import ApplicationsList from '../applications/ApplicationsList';
import CompanyLink from '../companies/CompanyLink';
import TechStack from '../companies/TechStack';
import Error from '../Error';
import LoadingModal from '../LoadingModal';
import Section from '../Section';
import SkillsList from '../skills/SkillsList';
import JobRoles from './JobRoles';
import Salary from './Salary';
import useJob from './useJob';

const JobDetails = ({ id }: { id: number }) => {
  const { job, error, isPlaceholderData, isPending } = useJob(id);

  if (error) {
    return <Error error={error} />;
  }

  if (isPending) {
    return <LoadingModal />;
  }

  if (!job) {
    return null;
  }

  return (
    <>
      {isPlaceholderData && <LoadingModal />}
      <Section
        height={12}
        title={
          <div className="flex justify-between">
            <div>{job.title}</div>
            <div>{new Date(job.created_at).toLocaleDateString()}</div>
          </div>
        }
      >
        <div className="flex flex-row gap-x-2 h-12">
          <CompanyLink {...job.company} />
          <Salary {...job} />
        </div>
      </Section>
      <Section title="Description">{job.description}</Section>
      <Section title="Roles">
        <JobRoles {...job} />
      </Section>
      <Section title="Requirements">
        <div className="pt-2">
          <SkillsList skills={job.skills} />
        </div>
      </Section>
      <Section title="Company Tech Stack">
        <TechStack {...job.company} />
      </Section>
      <Section title="Applications" isLast={true}>
        {job.applications ? (
          <ApplicationsList applications={job.applications} />
        ) : null}
      </Section>
    </>
  );
};

export default JobDetails;
