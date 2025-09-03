import ApplicationsList from '../applications/ApplicationsList';
import CompanyLink from '../companies/CompanyLink';
import Error from '../Error';
import useJob from '../hooks/useJob';
import LoadingModal from '../LoadingModal';
import RoleLink from '../roles/RoleLink';
import { roleLevel } from '../roles/utils';
import JobSkills from './JobSkills';
import Salary from './Salary';

const JobDetails = ({ id }: { id: number }) => {
  const { job, error, isPlaceholderData, isPending } = useJob({ id });

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
      <h2>{job.title}</h2>
      <h2>Company</h2>
      <div>{job.company && <CompanyLink company={job.company} />}</div>
      <h2>Role</h2>
      <div>
        <RoleLink role={job.role} /> ({roleLevel(job.role_level)})
      </div>
      <h2>Description</h2>
      <div>{job.description}</div>
      <h2>Created</h2>
      <div>{new Date(job.created_at).toDateString()}</div>
      <h2>Status</h2>
      <div>{job.status}</div>
      <h2>Salary</h2>
      <div>
        <Salary job={job} />
      </div>
      <h2>Skills</h2>
      <div>
        <JobSkills job={job} />
      </div>
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
