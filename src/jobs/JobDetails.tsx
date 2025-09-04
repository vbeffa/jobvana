import ApplicationsList from '../applications/ApplicationsList';
import CompanyLink from '../companies/CompanyLink';
import Error from '../Error';
import useJob from '../hooks/useJob';
import useRoles from '../hooks/useRoles';
import LoadingModal from '../LoadingModal';
import RoleLink from '../roles/RoleLink';
import { roleLevel } from '../roles/utils';
import JobSkills from './JobSkills';
import Salary from './Salary';

const JobDetails = ({ id }: { id: number }) => {
  const { job, error, isPlaceholderData, isPending } = useJob({ id });
  const { roles } = useRoles();

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
      <div>
        {job.company && <CompanyLink company={job.company} />} -{' '}
        <RoleLink {...job.role} /> ({roleLevel(job.role_level)})
      </div>
      <h2>Skills</h2>
      <div>
        <ul>
          {job.jobRoles.map((jobRole) => {
            const role = roles?.find((role) => role.id === jobRole.role_id);
            return (
              role && (
                <li key={role.id}>
                  <RoleLink {...role} /> ({jobRole.percent} %)
                </li>
              )
            );
          })}
        </ul>
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
      <h2>Tools / Tech Stack</h2>
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
