import CompanyLink from '../../companies/CompanyLink';
import JobvanaError from '../../JobvanaError';
import LoadingModal from '../../LoadingModal';
import Section from '../../Section';
import SkillsList from '../../skills/SkillsList';
import JobRoles from '../JobRoles';
import Salary from './Salary';
import useJob from './useJob';

const JobDetails = ({ id }: { id: number }) => {
  const { job, error, isPlaceholderData, isPending } = useJob(id);

  if (error) {
    return <JobvanaError error={error} />;
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
        title={
          <div className="flex justify-between">
            <div>{job.title}</div>
            <div>{new Date(job.created_at).toLocaleDateString()}</div>
          </div>
        }
      >
        <div className="flex flex-row gap-x-2">
          <CompanyLink {...job.company} />
          <Salary {...job} />
        </div>
        <div className="text-sm">
          {job.address ? `${job.address.city}, ${job.address.state}` : 'Remote'}
        </div>
      </Section>
      <Section title="Description">{job.description}</Section>
      <Section title="Roles">
        <JobRoles {...job} />
      </Section>
      <Section title="Skills" isLast={true}>
        <SkillsList skills={job.skills} />
      </Section>
      {/* <Section title="Applications" isLast={true}>
        {job.applications ? (
          <ApplicationsList applications={job.applications} />
        ) : null}
      </Section> */}
    </>
  );
};

export default JobDetails;
