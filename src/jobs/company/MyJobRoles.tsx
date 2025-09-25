import _ from 'lodash';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { FaPlus, FaTrash, FaTriangleExclamation } from 'react-icons/fa6';
import EditDeleteIcons from '../../controls/EditDeleteIcons';
import Error from '../../Error';
import type { JobRole } from '../../types';
import supabase from '../../utils/supabase';
import JobRoles from '../JobRoles';
import LevelSelect from '../LevelSelect';
import RoleSelect from '../RoleSelect';
import type { Edit } from './MyJobs';
import PercentInput from './PercentInput';
import type { Job } from './useJobsForCompany';

export type MyJobRolesProps = {
  job: Job;
  onUpdate: () => void;
  edit: Edit;
  setEdit: (edit: Edit) => void;
};

const MyJobRoles = ({ job, onUpdate, edit, setEdit }: MyJobRolesProps) => {
  const [editJobRoles, setEditJobRoles] = useState<Array<JobRole>>(
    job.job_roles
  );
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<Error>();

  const isDirty = useMemo(
    () => !_.isEqual(job.job_roles, editJobRoles),
    [editJobRoles, job]
  );

  const percentTotalValid = useMemo(() => {
    return (
      editJobRoles.reduce((total, role) => total + role.percent, 0) === 100
    );
  }, [editJobRoles]);

  const duplicateRole = useMemo(() => {
    return (
      new Map(editJobRoles.map((jobRole) => [jobRole.role_id, jobRole.role_id]))
        .size < editJobRoles.length
    );
  }, [editJobRoles]);

  const isValid = useMemo(
    () => percentTotalValid && !duplicateRole,
    [duplicateRole, percentTotalValid]
  );

  useEffect(() => {
    if (edit.jobId !== job.id || edit.section !== 'roles') {
      setIsEditing(false);
    }
  }, [edit.jobId, edit.section, job.id]);

  const updateJobRoles = useCallback(async () => {
    let result = await supabase
      .from('job_roles')
      .delete()
      .filter('job_id', 'eq', job.id);
    if (result.error) {
      throw result.error;
    }

    result = await supabase.from('job_roles').upsert(editJobRoles, {
      onConflict: 'job_id, role_id',
      ignoreDuplicates: true
    });
    if (result.error) {
      throw result.error;
    }

    result = await supabase
      .from('jobs')
      .update({
        updated_at: new Date().toISOString()
      })
      .eq('id', job.id);
    if (result.error) {
      throw result.error;
    }
  }, [job.id, editJobRoles]);

  const doUpdate = useCallback(async () => {
    if (!isValid || !isDirty) {
      return;
    }

    setIsSubmitting(true);
    setError(undefined);

    try {
      await updateJobRoles();
      onUpdate();
    } catch (err) {
      console.log(err);
      setError(err as Error);
    } finally {
      setIsSubmitting(false);
    }
  }, [isDirty, isValid, onUpdate, updateJobRoles]);

  return (
    <>
      {error && <Error error={error} />}
      <div className="grid grid-cols-[20%_65%] gap-y-2 relative">
        <EditDeleteIcons
          isEditing={isEditing}
          setIsEditing={(isEditing) => {
            if (isEditing) {
              setError(undefined);
              setEdit({ jobId: job.id, section: 'roles' });
            }
            setIsEditing(isEditing);
          }}
          disabled={isEditing && (!isDirty || !isValid || isSubmitting)}
          onEdit={() => setEditJobRoles(job.job_roles)}
          onSave={doUpdate}
          bgColor="--color-white"
        />
        {isEditing && (
          <>
            <label htmlFor="role_0" className="content-center">
              Roles:
            </label>
            {editJobRoles.map((jobRole, idx) => (
              <div
                key={`role_${idx}_div`}
                className="col-start-2 flex flex-row gap-2"
              >
                <RoleSelect
                  id={`role_${idx}`}
                  roleId={jobRole.role_id}
                  showAny={false}
                  onChange={(roleId) => {
                    setEditJobRoles((roles) => {
                      const updatedRoles = _.cloneDeep(roles);
                      updatedRoles[idx].role_id = roleId;
                      return updatedRoles;
                    });
                  }}
                />
                <div className="relative flex flex-row gap-0.5">
                  <PercentInput
                    idx={idx}
                    value={jobRole.percent}
                    onChange={(percent) => {
                      setEditJobRoles((roles) => {
                        const updatedRoles = _.cloneDeep(roles);
                        updatedRoles[idx].percent = percent;
                        return updatedRoles;
                      });
                    }}
                  />
                  <div
                    className={`absolute ${
                      jobRole.percent >= 100
                        ? 'right-6'
                        : jobRole.percent >= 10
                          ? 'right-8'
                          : 'right-10'
                    } top-1 -z-10`}
                  >
                    %
                  </div>
                </div>
                <LevelSelect
                  id={`level_${idx}`}
                  value={jobRole.role_level}
                  onChange={(level) => {
                    setEditJobRoles((roles) => {
                      const updatedRoles = _.cloneDeep(roles);
                      updatedRoles[idx].role_level = level;
                      return updatedRoles;
                    });
                  }}
                />
                <div
                  className="content-center text-sm text-gray-400 cursor-pointer"
                  onClick={() => {
                    setEditJobRoles((roles) => {
                      const updatedRoles = _.cloneDeep(roles);
                      updatedRoles.splice(idx, 1);
                      return updatedRoles;
                    });
                  }}
                >
                  <FaTrash />
                </div>
                {(editJobRoles[idx].percent < 1 ||
                  editJobRoles[idx].percent > 100) && (
                  <div className="text-sm text-red-500 flex flex-row gap-1">
                    <div className="content-center">
                      <FaTriangleExclamation />
                    </div>
                    <div className="content-center">% out of range</div>
                  </div>
                )}
              </div>
            ))}
            <div className="relative col-start-2 pb-4">
              {!percentTotalValid && (
                <div className="text-sm text-red-500 flex flex-row gap-1 pl-50">
                  <div className="content-center">
                    <FaTriangleExclamation />
                  </div>
                  <div>% sum does not total 100</div>
                </div>
              )}
              {duplicateRole && (
                <div className="absolute left-0 top-0 text-sm text-red-500 flex flex-row gap-1">
                  <div className="content-center">
                    <FaTriangleExclamation />
                  </div>
                  <div>duplicate role</div>
                </div>
              )}
              {!duplicateRole && (
                <div
                  className="absolute left-0 top-1 text-gray-400 cursor-pointer"
                  onClick={() => {
                    setEditJobRoles((roles) => {
                      const updatedRoles = _.cloneDeep(roles);
                      updatedRoles.push({
                        job_id: job.id,
                        role_id: 1,
                        percent: 1,
                        role_level: 0
                      });
                      return updatedRoles;
                    });
                  }}
                >
                  <FaPlus />
                </div>
              )}
            </div>
          </>
        )}
        {!isEditing && (
          <>
            <div>Roles:</div>
            <div>
              <JobRoles jobRoles={job.job_roles} />
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default MyJobRoles;
