import _, { capitalize } from 'lodash';
import { useCallback, useMemo, useState } from 'react';
import { MAX_DESCRIPTION_LENGTH } from '../../companies/job_seeker/useCompanies';
import EditDeleteIcons from '../../controls/EditDeleteIcons';
import Error from '../../Error';
import TextArea from '../../inputs/TextArea';
import supabase from '../../utils/supabase';
import SalaryRangeInput from '../SalaryRangeInput';
import { MAX_SALARY, MIN_SALARY } from '../useJobs';
import { isValidJob, type ToUpdate } from '../utils';
import MyJobTitle from './MyJobTitle';
import StatusSelect from './StatusSelect';
import type { Job } from './useJobsForCompany';

export type MyCompanyJobProps = {
  job: Job;
  onUpdate: () => void;
};

const MyJobMain = ({ job, onUpdate }: MyCompanyJobProps) => {
  const [editJob, setEditJob] = useState<ToUpdate>(job);
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<Error>();

  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  });

  const isDirty = useMemo(() => !_.isEqual(job, editJob), [editJob, job]);
  const isValid = useMemo(() => isValidJob(editJob), [editJob]);

  const updateJob = useCallback(async () => {
    if (!isDirty || !isValidJob(editJob)) {
      return;
    }
    const toUpdate = _.omit(editJob, 'job_roles');
    const { error } = await supabase
      .from('jobs')
      .update({
        ...toUpdate,
        updated_at: new Date().toISOString()
      })
      .eq('id', job.id);

    if (error) {
      throw error;
    }
  }, [editJob, isDirty, job.id]);

  const doUpdate = useCallback(async () => {
    setIsSubmitting(true);
    setError(undefined);
    try {
      await updateJob();
      onUpdate();
    } catch (err) {
      console.log(err);
      setError(err as Error);
    } finally {
      setIsSubmitting(false);
    }
  }, [onUpdate, updateJob]);

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
          isEditing={isEditing}
          setIsEditing={(isEditing) => {
            if (isEditing) {
              setError(undefined);
            }
            setIsEditing(isEditing);
          }}
          disabled={isEditing && (!isDirty || !isValid || isSubmitting)}
          onEdit={() => setEditJob(job)}
          onDelete={deleteJob}
          onSave={async () => {
            await doUpdate();
          }}
          bgColor="--color-white"
        />
        {isEditing && (
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
          </>
        )}
        {!isEditing && (
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
          </>
        )}
      </div>
    </>
  );
};

export default MyJobMain;
