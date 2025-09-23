import _, { capitalize } from 'lodash';
import { useCallback, useMemo, useState } from 'react';
import { MAX_DESCRIPTION_LENGTH } from '../../companies/job_seeker/useCompanies';
import { isValid, isValidJob } from '../../companies/utils';
import EditDeleteIcons from '../../controls/EditDeleteIcons';
import Error from '../../Error';
import TextArea from '../../inputs/TextArea';
import type { Job } from '../../types';
import supabase from '../../utils/supabase';
import SalarySelect from '../SalarySelect';
import type { ToUpdate } from '../utils';
import MyJobTitle from './MyJobTitle';
import StatusSelect from './StatusSelect';

export type MyCompanyJobProps = {
  job: Job;
  onUpdate: () => void;
};

const MyJob = ({ job, onUpdate }: MyCompanyJobProps) => {
  const [editJob, setEditJob] = useState<ToUpdate>(job);
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
    setIsSubmitting(true);
    setError(undefined);
    try {
      const { error } = await supabase
        .from('jobs')
        .update({ ...editJob, updated_at: new Date().toISOString() })
        .eq('id', job.id)
        .select();

      if (error) {
        console.log(error);
        setError(error);
      } else {
        onUpdate();
      }
    } finally {
      setIsSubmitting(false);
    }
  }, [editJob, job.id, onUpdate]);

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
          disabled={editMode && (!isValid || !isDirty || isSubmitting)}
          onEdit={() => setEditJob(job)}
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
            <label htmlFor="min_salary" className="content-center">
              Salary:
            </label>
            <div className="flex flex-row gap-x-2">
              <SalarySelect
                id="min_salary"
                value={editJob.salary_low}
                width="w-32"
                onChange={(minSalary) => {
                  setEditJob((editJob) => ({
                    ...editJob,
                    salary_low: minSalary,
                    salary_high:
                      editJob.salary_high && minSalary > editJob.salary_high
                        ? minSalary
                        : editJob.salary_high
                  }));
                }}
              />
              <label htmlFor="max_salary" className="content-center">
                -
              </label>
              <SalarySelect
                id="max_salary"
                value={editJob.salary_high}
                width="w-32"
                onChange={(maxSalary) => {
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
            </div>
          </>
        )}
        {!editMode && job && (
          <>
            <div className="h-[33px] content-center">Title:</div>
            <div className="pl-[4.5px] pt-[4.5px]">{job.title}</div>
            <div className="h-[160px] content-start">Description:</div>
            <div className="pl-[4.5px] pt-[4.5px]">{job.description}</div>
            <div className="h-[30px] content-center">Status:</div>
            <div className="pl-[4.5px] pt-[3px]">{capitalize(job.status)}</div>
            <div className="h-[33.5px] content-center">Salary:</div>
            <div className="pl-[4.5px] pt-[5px] flex flex-row gap-1">
              <div className="w-32">{formatter.format(job.salary_low)}</div>
              <div className="">-</div>
              <div className="ml-2 w-32">
                {formatter.format(job.salary_high)}
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default MyJob;
