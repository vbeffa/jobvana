import _ from 'lodash';
import { useCallback, useMemo, useState } from 'react';
import EditDeleteIcons from '../../controls/EditDeleteIcons';
import Error from '../../Error';
import TextArea from '../../inputs/TextArea';
import type { ToUpdate } from '../../jobs/utils';
import type { Job } from '../../types';
import supabase from '../../utils/supabase';
import { MAX_DESCRIPTION_LENGTH } from '../job_seeker/useCompanies';
import { isValid, isValidJob } from '../utils';
import MyJobTitle from './MyJobTitle';

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
      <div className="grid grid-cols-[20%_65%] gap-y-4 relative">
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
              onChange={(description) =>
                setEditJob((editJob) => ({
                  ...editJob,
                  description
                }))
              }
            />
          </>
        )}
        {!editMode && job && (
          <>
            <div className="pt-[4.5px] content-start">Title:</div>
            <div className="h-[32.5px] pl-[4.5px] pt-[4.5px]">{job.title}</div>
            <div className="pt-[0.5px] content-start">Description:</div>
            <div className="h-[160px] pl-[4.5px] pt-[5px]">
              {job.description}
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default MyJob;
