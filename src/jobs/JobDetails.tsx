import ApplicationsList from '../applications/ApplicationsList';
import CompanyLink from '../companies/CompanyLink';
import Error from '../Error';
import useJob from '../hooks/useJob';
import LoadingModal from '../LoadingModal';
import SkillsList from '../skills/SkillsList';
import JobRoles from './JobRoles';
import Salary from './Salary';

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
      <h2>
        <div className="flex justify-between">
          <div>{job.title}</div>
          <div>{new Date(job.created_at).toLocaleDateString()}</div>
        </div>
      </h2>
      <div className="flex flex-row gap-x-2">
        <CompanyLink {...job.company} />
        <Salary {...job} />
        <div></div>
      </div>
      <hr className="my-4 border-gray-400 shadow" />
      <h2>Description</h2>
      <div>{job.description}</div>
      <hr className="my-4 border-gray-400 shadow" />
      <h2>Roles</h2>
      <div>
        <JobRoles {...job} />
      </div>
      <hr className="my-4 border-gray-400 shadow" />
      <h2>Requirements</h2>
      <div className="pt-2">
        <SkillsList skills={job.skills} />
      </div>
      <hr className="my-4 border-gray-400 shadow" />
      <h2>Company Tech Stack</h2>
      <div className="pt-2">
        <SkillsList skills={job.skills} />
      </div>
      <hr className="my-4 border-gray-400 shadow" />
      <h2>Applications</h2>
      <div>
        {job.applications && (
          <ApplicationsList applications={job.applications} />
        )}
      </div>
    </>
  );
};

export default JobDetails;
