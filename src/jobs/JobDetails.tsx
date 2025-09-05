import ApplicationsList from '../applications/ApplicationsList';
import CompanyLink from '../companies/CompanyLink';
import Error from '../Error';
import useJob from '../hooks/useJob';
import useRoles from '../hooks/useRoles';
import LoadingModal from '../LoadingModal';
import RoleLink from '../roles/RoleLink';
import { roleLevel } from '../roles/utils';
import SkillsList from '../skills/SkillsList';
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
      <h2>
        <div className="flex justify-between">
          <div>{job.title}</div>
          <div>{new Date(job.created_at).toLocaleDateString()}</div>
        </div>
      </h2>
      <div className="flex flex-row gap-x-2">
        <CompanyLink company={job.company} />
        <Salary {...job} />
        <div></div>
      </div>
      <hr className="my-4 border-gray-400 shadow" />
      <h2>Role</h2>
      <div>
        {roleLevel(job.role_level)} {job.role.name}
      </div>
      <hr className="my-4 border-gray-400 shadow" />
      <h2>Roles</h2>
      <div>
        <ul>
          {job.jobRoles.map((jobRole) => {
            const role = roles?.find((role) => role.id === jobRole.role_id);
            return (
              role && (
                <li key={role.id}>
                  <RoleLink {...role} /> ({jobRole.percent}%)
                </li>
              )
            );
          })}
        </ul>
      </div>
      <hr className="my-4 border-gray-400 shadow" />
      <h2>Description</h2>
      <div>{job.description}</div>
      <hr className="my-4 border-gray-400 shadow" />
      <h2>Tools / Tech Stack</h2>
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
