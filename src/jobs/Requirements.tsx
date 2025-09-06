import { type JobRole } from '../hooks/useJobs';
import useRoles from '../hooks/useRoles';
import RoleLink from '../roles/RoleLink';
import { roleLevel } from '../roles/utils';

export type RequirementsProps = {
  requirements: Array<Pick<JobRole, 'role_id' | 'percent' | 'role_level'>>;
};

const Requirements = ({ requirements }: RequirementsProps) => {
  const { roles } = useRoles();

  return (
    <ul>
      {requirements.map((requirement) => {
        const role = roles?.find((role) => role.id === requirement.role_id);
        return (
          role && (
            <li key={role.id}>
              <RoleLink {...role} /> ({requirement.percent}%,{' '}
              {roleLevel(requirement.role_level)})
            </li>
          )
        );
      })}
    </ul>
  );
};

export default Requirements;
