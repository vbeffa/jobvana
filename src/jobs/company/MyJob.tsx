import _, { capitalize } from 'lodash';
import { useCallback, useMemo, useState } from 'react';
import { FaTriangleExclamation } from 'react-icons/fa6';
import { MAX_DESCRIPTION_LENGTH } from '../../companies/job_seeker/useCompanies';
import { isValid, isValidJob } from '../../companies/utils';
import EditDeleteIcons from '../../controls/EditDeleteIcons';
import Error from '../../Error';
import NumberInput from '../../inputs/NumberInput';
import TextArea from '../../inputs/TextArea';
import useRoles from '../../roles/useRoles';
import supabase from '../../utils/supabase';
import LevelSelect from '../LevelSelect';
import RoleSelect from '../RoleSelect';
import SalaryRange from '../SalaryRange';
import type { JobRole } from '../useJob';
import type { ToUpdate } from '../utils';
import MyJobTitle from './MyJobTitle';
import StatusSelect from './StatusSelect';
import type { Job } from './useJobsForCompany';

export type MyCompanyJobProps = {
  job: Job;
  onUpdate: () => void;
  setUpdating: (updating: boolean) => void;
};

const MyJob = ({ job, onUpdate, setUpdating }: MyCompanyJobProps) => {
  const { roles } = useRoles();
  const [editJob, setEditJob] = useState<ToUpdate>(job);
  const [editRoles, setEditRoles] = useState<Array<JobRole>>();
  const [editMode, setEditMode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<Error>();

  const isDirty = useMemo(() => !_.isEqual(job, editJob), [editJob, job]);
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  });

  const updateJob = useCallback(async () => {
    if (!editJob) {
      return;
    }
    if (!isValidJob(editJob)) {
      return;
    }
    const toUpdate = _.omit(editJob, 'jobRoles', 'job_roles');
    setIsSubmitting(true);
    setError(undefined);
    setUpdating(true);
    try {
      const { error } = await supabase
        .from('jobs')
        .update({
          ...toUpdate,
          updated_at: new Date().toISOString()
        })
        .eq('id', job.id)
        .select();

      if (error) {
        console.log(error);
        setError(error);
        setUpdating(false);
      } else {
        onUpdate();
      }
    } finally {
      setIsSubmitting(false);
    }
  }, [editJob, job.id, onUpdate, setUpdating]);

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

  return (
    <>
      {error && <Error error={error} />}
      <div className="grid grid-cols-[20%_65%] gap-y-2 relative">
        <EditDeleteIcons
          type="job"
          editMode={editMode}
          setEditMode={setEditMode}
          disabled={editMode && (!isValid || !isDirty || isSubmitting)}
          onEdit={() => {
            setEditJob(job);
            setEditRoles(job.jobRoles);
          }}
          onDelete={deleteJob}
          onSave={updateJob}
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
            <SalaryRange
              low={editJob.salary_low}
              high={editJob.salary_high}
              onChangeLow={(minSalary) => {
                setEditJob((editJob) => ({
                  ...editJob,
                  salary_low: minSalary,
                  salary_high:
                    editJob.salary_high && minSalary > editJob.salary_high
                      ? minSalary
                      : editJob.salary_high
                }));
              }}
              onChangeHigh={(maxSalary) => {
                setEditJob((editJob) => ({
                  ...editJob,
                  salary_high: maxSalary,
                  salary_low:
                    editJob.salary_low && maxSalary < editJob.salary_low
                      ? maxSalary
                      : editJob.salary_low
                }));
              }}
            />

            {editRoles && editRoles.length > 0 && (
              <>
                <label htmlFor="role_0" className="content-center">
                  Roles:
                </label>
                {editRoles.map((jobRole, idx) => (
                  <div
                    key={`role_${idx}_div`}
                    className={`${idx > 0 ? 'col-start-2' : ''} flex flex-row gap-2`}
                  >
                    <RoleSelect
                      id={`role_${idx}`}
                      roleId={jobRole.role_id}
                      showAny={false}
                      onChange={(roleId) => {
                        setEditRoles((roles) => {
                          if (!roles) {
                            return undefined;
                          }
                          roles[idx].role_id = roleId;
                          return _.cloneDeep(roles);
                        });
                      }}
                    />
                    <div className="relative flex flex-row gap-0.5">
                      <NumberInput
                        id={`role_percent_${idx}`}
                        value={jobRole.percent}
                        min={1}
                        max={100}
                        onChange={(value) => {
                          if (!value) {
                            return;
                          }
                          setEditRoles((roles) => {
                            if (!roles) {
                              return undefined;
                            }
                            if (roles) {
                              roles[idx].percent = value;
                            }
                            return _.cloneDeep(roles);
                          });
                        }}
                        width="w-18"
                      />
                      <div
                        className={`absolute ${
                          jobRole.percent === 100
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
                          if (!roles) {
                            return undefined;
                          }
                          if (roles) {
                            roles[idx].role_level = level;
                          }
                          return _.cloneDeep(roles);
                        });
                      }}
                    />
                  </div>
                ))}
                {!percentTotalValid && (
                  <div className="col-start-2 text-sm text-yellow-500 flex flex-row gap-1">
                    <div className="content-center">
                      <FaTriangleExclamation />
                    </div>
                    <div>Role percentages do not total 100</div>
                  </div>
                )}
              </>
            )}
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
              {job.jobRoles.map((jobRole, idx) => {
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
