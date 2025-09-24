import _, { capitalize } from 'lodash';
import { useCallback, useMemo, useState } from 'react';
import { FaPlus, FaTriangleExclamation, FaX } from 'react-icons/fa6';
import { MAX_DESCRIPTION_LENGTH } from '../../companies/job_seeker/useCompanies';
import EditDeleteIcons from '../../controls/EditDeleteIcons';
import Error from '../../Error';
import TextArea from '../../inputs/TextArea';
import useRoles from '../../roles/useRoles';
import type { JobRole } from '../../types';
import supabase from '../../utils/supabase';
import LevelSelect from '../LevelSelect';
import RoleSelect from '../RoleSelect';
import SalaryRangeInput from '../SalaryRangeInput';
import { MAX_SALARY, MIN_SALARY } from '../useJobs';
import { isValidJob, type ToUpdate } from '../utils';
import MyJobTitle from './MyJobTitle';
import PercentInput from './PercentInput';
import StatusSelect from './StatusSelect';
import type { Job } from './useJobsForCompany';

export type MyCompanyJobProps = {
  job: Job;
  onUpdate: () => void;
};

const MyJob = ({ job, onUpdate }: MyCompanyJobProps) => {
  const { roles } = useRoles();
  const [editJob, setEditJob] = useState<ToUpdate>(job);
  const [editRoles, setEditRoles] = useState<Array<JobRole>>(job.job_roles);
  const [editMode, setEditMode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<Error>();

  const isJobDirty = useMemo(() => !_.isEqual(job, editJob), [editJob, job]);

  const areJobRolesDirty = useMemo(
    () => !_.isEqual(job.job_roles, editRoles),
    [editRoles, job]
  );

  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  });

  const percentTotalValid = useMemo(() => {
    if (!editRoles) {
      return true;
    }
    const totalPercent = editRoles.reduce(
      (total, role) => total + role.percent,
      0
    );
    return totalPercent === 100;
  }, [editRoles]);

  const updateJob = useCallback(async () => {
    if (!isJobDirty || !isValidJob(editJob)) {
      return;
    }
    const toUpdate = _.omit(editJob, 'job_roles');
    const { error } = await supabase
      .from('jobs')
      .update({
        ...toUpdate,
        updated_at: new Date().toISOString()
      })
      .eq('id', job.id)
      .select();

    if (error) {
      throw error;
    }
  }, [editJob, isJobDirty, job.id]);

  const updateJobRoles = useCallback(async () => {
    if (!areJobRolesDirty || !percentTotalValid) {
      return;
    }
    console.log(editRoles);
    let { error } = await supabase
      .from('job_roles')
      .delete()
      .filter('job_id', 'eq', job.id);
    if (error) {
      console.log(error);
    }

    error = (await supabase.from('job_roles').insert(editRoles)).error;

    if (error) {
      throw error;
    }
  }, [areJobRolesDirty, editRoles, job.id, percentTotalValid]);

  const doUpdate = useCallback(async () => {
    setIsSubmitting(true);
    setError(undefined);
    try {
      await updateJob();
      await updateJobRoles();
      onUpdate();
    } catch (err) {
      console.log(err);
      setError(err as Error);
    } finally {
      setIsSubmitting(false);
    }
  }, [onUpdate, updateJob, updateJobRoles]);

  const deleteJob = useCallback(async () => {
    setIsSubmitting(true);
    setError(undefined);
    try {
      const { error } = await supabase.from('jobs').delete().eq('id', job.id);

      if (error) {
        console.log(error);
        setError(error);
      } else {
        onUpdate();
      }
    } finally {
      setIsSubmitting(false);
    }
  }, [job.id, onUpdate]);

  return (
    <>
      {error && <Error error={error} />}
      <div className="grid grid-cols-[20%_65%] gap-y-2 relative">
        <EditDeleteIcons
          type="job"
          editMode={editMode}
          setEditMode={setEditMode}
          disabled={
            editMode &&
            ((!isJobDirty && !areJobRolesDirty) ||
              !isValidJob(editJob) ||
              !percentTotalValid ||
              isSubmitting)
          }
          onEdit={() => {
            setEditJob(job);
            setEditRoles(job.job_roles);
          }}
          onDelete={deleteJob}
          onSave={doUpdate}
          bgColor="--color-white"
        />
        {editMode && editJob && (
          <>
            <MyJobTitle title={editJob.title} handleUpdate={setEditJob} />
            <TextArea
              id="description"
              label="Description"
              value={editJob.description ?? undefined}
              maxLength={MAX_DESCRIPTION_LENGTH}
              rows={Math.max(
                3,
                Math.ceil((editJob.description?.length ?? 0) / 70.0)
              )}
              onChange={(description) => {
                setEditJob((editJob) => ({
                  ...editJob,
                  description
                }));
              }}
            />
            <StatusSelect
              status={editJob.status}
              onChange={(status) => {
                setEditJob((editJob) => ({
                  ...editJob,
                  status
                }));
              }}
            />
            <SalaryRangeInput
              low={editJob.salary_low}
              high={editJob.salary_high}
              onChangeLow={(minSalary) => {
                if (!minSalary) {
                  return;
                }
                setEditJob((editJob) => ({
                  ...editJob,
                  salary_low: minSalary,
                  salary_high:
                    editJob.salary_high && minSalary > editJob.salary_high
                      ? minSalary
                      : Math.min(editJob.salary_high, MAX_SALARY)
                }));
              }}
              onChangeHigh={(maxSalary) => {
                if (!maxSalary) {
                  return;
                }
                setEditJob((editJob) => ({
                  ...editJob,
                  salary_high: maxSalary,
                  salary_low:
                    editJob.salary_low && maxSalary < editJob.salary_low
                      ? maxSalary
                      : Math.max(editJob.salary_low, MIN_SALARY)
                }));
              }}
            />

            <>
              <label htmlFor="role_0" className="content-center">
                Roles:
              </label>
              {editRoles.map((jobRole, idx) => (
                <div
                  key={`role_${idx}_div`}
                  className="col-start-2 flex flex-row gap-2"
                >
                  <RoleSelect
                    id={`role_${idx}`}
                    roleId={jobRole.role_id}
                    showAny={false}
                    onChange={(roleId) => {
                      setEditRoles((roles) => {
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
                        setEditRoles((roles) => {
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
                      setEditRoles((roles) => {
                        const updatedRoles = _.cloneDeep(roles);
                        updatedRoles[idx].role_level = level;
                        return updatedRoles;
                      });
                    }}
                  />
                  <div
                    className="content-center text-sm text-gray-400 cursor-pointer"
                    onClick={() => {
                      setEditRoles((roles) => {
                        const updatedRoles = _.cloneDeep(roles);
                        updatedRoles.splice(idx, 1);
                        return updatedRoles;
                      });
                    }}
                  >
                    <FaX />
                  </div>
                  {(editRoles[idx].percent < 1 ||
                    editRoles[idx].percent > 100) && (
                    <div className="text-sm text-red-500 flex flex-row gap-1">
                      <div className="content-center">
                        <FaTriangleExclamation />
                      </div>
                      <div className="content-center">% out of range</div>
                    </div>
                  )}
                </div>
              ))}
              <div className="relative col-start-2">
                {!percentTotalValid && (
                  <div className="text-sm text-red-500 flex flex-row gap-1 pl-51">
                    <div className="content-center">
                      <FaTriangleExclamation />
                    </div>
                    <div>% does not total 100</div>
                  </div>
                )}
                <div
                  className="absolute left-0 top-1 text-gray-400 cursor-pointer"
                  onClick={() => {
                    setEditRoles((roles) => {
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
              </div>
            </>
          </>
        )}
        {!editMode && job && (
          <>
            <div>Title:</div>
            <div>{job.title}</div>
            <div>Description:</div>
            <div>{job.description}</div>
            <div>Status:</div>
            <div>{capitalize(job.status)}</div>
            <div>Salary:</div>
            <div className="flex flex-row gap-1">
              <div>{formatter.format(job.salary_low)}</div>
              <div>-</div>
              <div>{formatter.format(job.salary_high)}</div>
            </div>
            <div>Roles:</div>
            <div>
              {job.job_roles.map((jobRole, idx) => {
                const role = roles?.find((role) => role.id === jobRole.role_id);
                return role ? (
                  <div key={idx}>
                    {role.name}, {jobRole.percent}%, level {jobRole.role_level}
                  </div>
                ) : null;
              })}
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default MyJob;
