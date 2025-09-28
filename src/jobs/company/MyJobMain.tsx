import _, { capitalize } from 'lodash';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { MAX_DESCRIPTION_LENGTH } from '../../companies/job_seeker/useCompanies';
import EditDeleteIcons from '../../controls/EditDeleteIcons';
import Error from '../../Error';
import TextArea from '../../inputs/TextArea';
import supabase from '../../utils/supabase';
import { MAX_SALARY, MIN_SALARY } from '../job_seekers/useJobs';
import { isValidJob, type ToUpdate } from '../utils';
import type { Edit } from './MyJobs';
import MyJobTitle from './MyJobTitle';
import SalaryRangeInput from './SalaryRangeInput';
import StatusSelect from './StatusSelect';
import type { Job } from './useJobsForCompany';

export type MyJobMainProps = {
  job: Job;
  onStartUpdate: () => void;
  onFinishUpdate: () => void;
  edit: Edit;
  setEdit: (edit: Edit) => void;
};

const MyJobMain = ({
  job,
  onStartUpdate,
  onFinishUpdate,
  edit,
  setEdit
}: MyJobMainProps) => {
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

  useEffect(() => {
    if (edit.jobId !== job.id || edit.section !== 'main') {
      setIsEditing(false);
    }
  }, [edit.jobId, edit.section, job.id]);

  useEffect(() => {
    setEditJob(job);
  }, [job]);

  const updateJob = useCallback(async () => {
    const toUpdate = _.omit(editJob, 'job_roles', 'job_skills');
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
  }, [editJob, job.id]);

  const doUpdate = useCallback(async () => {
    if (!isValid || !isDirty) {
      return;
    }

    setIsSubmitting(true);
    setError(undefined);
    try {
      onStartUpdate();
      await updateJob();
      onFinishUpdate();
    } catch (err) {
      console.log(err);
      setError(err as Error);
    } finally {
      setIsSubmitting(false);
    }
  }, [isDirty, isValid, onStartUpdate, onFinishUpdate, updateJob]);

  const deleteJob = useCallback(async () => {
    setIsSubmitting(true);
    setError(undefined);
    try {
      onStartUpdate();
      const { error } = await supabase.from('jobs').delete().eq('id', job.id);

      if (error) {
        console.log(error);
        setError(error);
      } else {
        onFinishUpdate();
      }
    } finally {
      setIsSubmitting(false);
    }
  }, [job.id, onStartUpdate, onFinishUpdate]);

  return (
    <>
      {error && <Error error={error} />}
      <div className="grid grid-cols-[15%_75%] gap-y-2 relative">
        <EditDeleteIcons
          type="job"
          isEditing={isEditing}
          disabled={isEditing && (!isDirty || !isValid || isSubmitting)}
          onEdit={() => {
            setError(undefined);
            setEdit({ jobId: job.id, section: 'main' });
            setEditJob(job);
            setIsEditing(true);
          }}
          onCancel={() => {
            setEditJob(job);
            setIsEditing(false);
          }}
          onDelete={deleteJob}
          onSave={async () => {
            setIsEditing(false);
            await doUpdate();
          }}
        />
        {!isEditing && (
          <>
            {/* Display editJob so that when changes are saved and isEditing is set to false,
                changes remain visible until job refetch completes */}
            <div>Title:</div>
            <div>{editJob.title}</div>
            <div>Description:</div>
            <div>{editJob.description}</div>
            <div>Status:</div>
            <div>{capitalize(editJob.status)}</div>
            <div>Salary:</div>
            <div className="flex flex-row gap-1">
              <div>{formatter.format(editJob.salary_low)}</div>
              <div>-</div>
              <div>{formatter.format(editJob.salary_high)}</div>
            </div>
          </>
        )}
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
                Math.ceil((editJob.description?.length ?? 0) / 82.0)
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
      </div>
    </>
  );
};

export default MyJobMain;
