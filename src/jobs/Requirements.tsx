import { type JobRole } from '../hooks/useJobs';
import useRoles from '../hooks/useRoles';
import RoleLink from '../roles/RoleLink';

export type RequirementsProps = {
  requirements: Array<Pick<JobRole, 'role_id' | 'percent' | 'role_level'>>;
};

const Requirements = ({ requirements }: RequirementsProps) => {
  const { roles } = useRoles();

  const levelBar = (level: number) => {
    switch (level) {
      case 0:
        return (
          <div className="border-[0.5px] inline-block w-10 h-2">
            <div className="w-2 h-2 bg-blue-500"></div>
          </div>
        );
      case 1:
        return (
          <div className="border-[0.5px] inline-block w-10 h-2">
            <div className="w-4 h-2 bg-blue-500"></div>
          </div>
        );
      case 2:
        return (
          <div className="border-[0.5px] inline-block w-10 h-2">
            <div className="w-6 h-2 bg-blue-500"></div>
          </div>
        );
      case 3:
        return (
          <div className="border-[0.5px] inline-block w-10 h-2">
            <div className="w-8 h-2 bg-blue-500"></div>
          </div>
        );
      case 4:
        return (
          <div className="border-[0.5px] inline-block w-10 h-2">
            <div className="w-10 h-2 bg-blue-500"></div>
          </div>
        );
    }
  };

  return (
    <ul>
      {requirements.map((requirement) => {
        const role = roles?.find((role) => role.id === requirement.role_id);
        return (
          role && (
            <li key={role.id}>
              <RoleLink {...role} /> ({requirement.percent}%,{' '}
              {levelBar(requirement.role_level)})
            </li>
          )
        );
      })}
    </ul>
  );
};

export default Requirements;
