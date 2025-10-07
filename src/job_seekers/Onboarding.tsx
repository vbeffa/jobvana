import { useCallback, useContext, useMemo, useState } from 'react';
import { getSession } from '../auth/utils';
import { JobSeekerContext } from '../Context';
import Button from '../controls/Button';
import supabase from '../db/supabase';
import JobvanaError from '../JobvanaError';
import ProfileEdit from './ProfileEdit';
import { isValidJobSeeker, type ToInsert } from './utils';

const Onboarding = ({ userId }: { userId: string }) => {
  const { setJobSeeker } = useContext(JobSeekerContext);
  const session = getSession();
  const [newJobSeeker, setNewJobSeeker] = useState<ToInsert>({
    user_id: userId,
    first_name: session?.user.user_metadata.first_name,
    last_name: session?.user.user_metadata.last_name,
    active_resume_id: null
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<Error>();

  const submitDisabled = useMemo(
    () => isSubmitting || !isValidJobSeeker(newJobSeeker),
    [isSubmitting, newJobSeeker]
  );

  const addJobSeeker = useCallback(async () => {
    if (!isValidJobSeeker(newJobSeeker)) {
      return;
    }
    setIsSubmitting(true);
    setError(undefined);
    try {
      const { data, error } = await supabase
        .from('job_seekers')
        .insert(newJobSeeker as ToInsert)
        .select();

      if (error) {
        console.log(error);
        setError(error);
      } else {
        setJobSeeker(data[0]);
      }
    } finally {
      setIsSubmitting(false);
    }
  }, [newJobSeeker, setJobSeeker]);

  return (
    <>
      <h1>Onboarding</h1>
      {error && <JobvanaError error={error} />}
      <div className="flex justify-center">
        <div className="border-[0.5px] border-blue-300 rounded-lg w-[36rem]">
          <div className="m-4 grid grid-cols-[25%_75%] gap-y-2">
            <ProfileEdit
              jobSeeker={newJobSeeker}
              setJobSeeker={setNewJobSeeker}
              isOnboarding={true}
            />
            <div className="text-center col-span-2 text-sm">
              All fields are required
            </div>
            <div className="text-center col-span-2">
              <Button
                label="Continue"
                disabled={submitDisabled}
                onClick={addJobSeeker}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Onboarding;
