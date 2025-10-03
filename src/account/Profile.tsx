import _ from 'lodash';
import { useCallback, useContext, useMemo, useState } from 'react';
import { JobSeekerContext, type JobSeeker } from '../Context';
import Button from '../controls/Button';
import supabase from '../db/supabase';
import ProfileEdit from '../job_seekers/ProfileEdit';
import { isValidJobSeeker, type ToUpdate } from '../job_seekers/utils';
import JobvanaError from '../JobvanaError';

const Profile = ({ jobSeeker }: { jobSeeker: JobSeeker }) => {
  const { setJobSeeker } = useContext(JobSeekerContext);
  const [editJobSeeker, setEditJobSeeker] = useState<ToUpdate>(jobSeeker);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [error, setError] = useState<Error>();

  const isDirty = useMemo(
    () => !_.isEqual(jobSeeker, editJobSeeker),
    [editJobSeeker, jobSeeker]
  );

  const submitDisabled = useMemo(
    () => isSubmitting || !isDirty || !isValidJobSeeker(editJobSeeker),
    [editJobSeeker, isDirty, isSubmitting]
  );

  const updateJobSeeker = useCallback(async () => {
    if (!isValidJobSeeker(editJobSeeker)) {
      return;
    }
    setIsSubmitting(true);
    setUpdateSuccess(false);
    setError(undefined);
    try {
      const { data, error } = await supabase
        .from('job_seekers')
        .update(editJobSeeker as ToUpdate)
        .eq('id', editJobSeeker.id)
        .select();

      if (error) {
        console.log(error);
        setError(error);
      } else if (!data[0]) {
        setError(Error('No rows updated'));
      } else {
        setJobSeeker(data[0]);
        setUpdateSuccess(true);
      }
    } finally {
      setIsSubmitting(false);
    }
  }, [editJobSeeker, setJobSeeker]);

  return (
    <div className="grid grid-cols-[25%_75%] w-[400px] gap-y-2">
      <ProfileEdit jobSeeker={editJobSeeker} setJobSeeker={setEditJobSeeker} />
      <div className="text-center col-span-2 mt-2">
        <Button
          label="Update"
          disabled={submitDisabled}
          onClick={updateJobSeeker}
        />
      </div>
      <div className="text-center col-span-2">
        {updateSuccess && <>Profile updated.</>}
        {error && <JobvanaError error={error} />}
      </div>
    </div>
  );
};

export default Profile;
