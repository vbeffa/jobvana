import _ from 'lodash';
import { useMemo } from 'react';
import {
  FaCircleCheck,
  FaPlus,
  FaTrash,
  FaTriangleExclamation
} from 'react-icons/fa6';
import NumberInput from '../../inputs/NumberInput';
import type { JobRole } from '../../types';
import JobRoles from '../JobRoles';
import RoleSelect from '../RoleSelect';
import LevelSelect from './LevelSelect';
import { jobRolesPercentTotal } from './utils';

export type MyJobRolesProps = {
  jobId: number;
  jobRoles: Array<JobRole>;
  setJobRoles: React.Dispatch<React.SetStateAction<Array<JobRole>>>;
  isEditing: boolean;
  duplicateRole: boolean;
};

const MyJobRoles = ({
  jobId,
  jobRoles,
  setJobRoles,
  isEditing,
  duplicateRole
}: MyJobRolesProps) => {
  const percentTotal = useMemo(() => {
    return jobRolesPercentTotal(jobRoles);
  }, [jobRoles]);

  const percentTotalValid = useMemo(() => {
    return percentTotal === 100;
  }, [percentTotal]);

  return (
    <div className="grid grid-cols-[15%_75%] gap-y-2">
      {!isEditing && (
        <>
          <div>Roles:</div>
          <div>
            <JobRoles jobRoles={jobRoles} />
          </div>
        </>
      )}
      {isEditing && (
        <>
          <label htmlFor="role_0" className="content-center">
            Roles:
          </label>
          {jobRoles.map((jobRole, idx) => (
            <div
              key={`role_${idx}_div`}
              className="col-start-2 flex flex-row gap-2"
            >
              <RoleSelect
                id={`role_${idx}`}
                roleId={jobRole.role_id}
                showAny={false}
                showEmpty={true}
                onChange={(roleId) => {
                  setJobRoles((jobRoles) => {
                    const updatedJobRoles = _.cloneDeep(jobRoles);
                    updatedJobRoles[idx].role_id = roleId;
                    return updatedJobRoles;
                  });
                }}
              />
              <NumberInput
                id={`role_percent_${idx}`}
                value={jobRole.percent}
                min={1}
                max={100}
                showPercent={true}
                onChange={(value) => {
                  if (!value) {
                    return;
                  }
                  setJobRoles((roles) => {
                    const updatedJobRoles = _.cloneDeep(roles);
                    updatedJobRoles[idx].percent = value;
                    return updatedJobRoles;
                  });
                }}
                width="w-24"
              />
              <LevelSelect
                id={`level_${idx}`}
                value={jobRole.role_level}
                onChange={(level) => {
                  setJobRoles((roles) => {
                    const updatedJobRoles = _.cloneDeep(roles);
                    updatedJobRoles[idx].role_level = level;
                    return updatedJobRoles;
                  });
                }}
              />
              {jobRoles.length > 1 && (
                <div
                  className="content-center text-sm text-gray-400 cursor-pointer"
                  onClick={() => {
                    setJobRoles((roles) => {
                      const updatedJobRoles = _.cloneDeep(roles);
                      updatedJobRoles.splice(idx, 1);
                      return updatedJobRoles;
                    });
                  }}
                >
                  <FaTrash />
                </div>
              )}
            </div>
          ))}
          <div
            className={`relative col-start-2 ${percentTotalValid ? 'pb-0' : 'pb-0'}`}
          >
            {!percentTotalValid && (
              <div className="text-sm text-red-500 flex flex-row gap-1 pl-50">
                <div className="content-center">
                  <FaTriangleExclamation />
                </div>
                <div>{percentTotal}%</div>
              </div>
            )}
            {percentTotalValid && (
              <div className="text-sm text-gray-500 flex flex-row gap-1 pl-50">
                <div className="content-center">
                  <FaCircleCheck />
                </div>
                <div>{percentTotal}%</div>
              </div>
            )}
            {duplicateRole && (
              <div className="absolute left-0 top-0 text-sm text-red-500 flex flex-row gap-1">
                <div className="content-center">
                  <FaTriangleExclamation />
                </div>
                <div>Duplicate role</div>
              </div>
            )}
            {!duplicateRole && jobRoles.length < 3 && (
              <div
                className="absolute left-0 top-1 text-gray-400 cursor-pointer"
                onClick={() => {
                  setJobRoles((roles) => {
                    const updatedJobRoles = _.cloneDeep(roles);
                    updatedJobRoles.push({
                      job_id: jobId,
                      role_id: 0,
                      percent: 100,
                      role_level: 2
                    });
                    return updatedJobRoles;
                  });
                }}
              >
                <FaPlus />
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default MyJobRoles;
