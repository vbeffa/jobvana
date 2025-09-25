import RoleLink from '../roles/RoleLink';
import useRoles from '../roles/useRoles';
import type { JobRole } from './useJob';

export type JobRolesProps = {
  jobRoles: Array<JobRole>;
};

const JobRoles = ({ jobRoles }: JobRolesProps) => {
  const { roles } = useRoles();

  const levelBar = (level: number) => {
    switch (level) {
      case 0:
        return (
          <div className="border-[0.5px] inline-block w-10 h-2">
            <div className="w-[7px] h-[7px] bg-blue-500"></div>
          </div>
        );
      case 1:
        return (
          <div className="border-[0.5px] inline-block w-10 h-2">
            <div className="w-[15px] h-[7px] bg-blue-500"></div>
          </div>
        );
      case 2:
        return (
          <div className="border-[0.5px] inline-block w-10 h-2">
            <div className="w-[23px] h-[7px] bg-blue-500"></div>
          </div>
        );
      case 3:
        return (
          <div className="border-[0.5px] inline-block w-10 h-2">
            <div className="w-[31px] h-[7px] bg-blue-500"></div>
          </div>
        );
      case 4:
        return (
          <div className="border-[0.5px] inline-block w-10 h-2">
            <div className="w-[39px] h-[7px] bg-blue-500"></div>
          </div>
        );
    }
  };

  return (
    <div className="">
      {jobRoles
        .sort((jobRole1, jobRole2) => {
          const role1 = roles?.find((role) => role.id === jobRole1.role_id);
          const role2 = roles?.find((role) => role.id === jobRole2.role_id);
          if (!role1 || !role2) {
            return 0;
          }
          return role1?.name.localeCompare(role2?.name);
        })
        .map((jobRole, idx) => {
          const role = roles?.find((role) => role.id === jobRole.role_id);
          return (
            role && (
              <div key={idx} className="flex flex-row gap-2">
                <div className="w-44">
                  <RoleLink {...role} />
                </div>
                <div className="w-10">{jobRole.percent}%</div>
                <div className="w-fit">{levelBar(jobRole.role_level)}</div>
              </div>
            )
          );
        })}
    </div>
  );
};

export default JobRoles;
