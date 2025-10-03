import type { FileObject } from '@supabase/storage-js';
import { useEffect, useState } from 'react';
import type { JobSeeker } from '../Context';
import supabase from '../db/supabase';
import JobvanaError from '../JobvanaError';

export type ResumeProps = {
  jobSeeker: JobSeeker;
};

const Resumes = ({ jobSeeker }: ResumeProps) => {
  const [resumes, setResumes] = useState<Array<FileObject> | null>();
  const [error, setError] = useState<Error>();

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase.storage
        .from('resumes')
        .list(`${jobSeeker.user_id}`);
      if (error) {
        console.log(error);
        setError(error);
      }
      console.log(data);
      setResumes(data);
    })();
  }, [jobSeeker.user_id]);
  console.log(jobSeeker);

  return (
    <div className="flex flex-col gap-2">
      Your resumes:
      {resumes?.map((resume, idx) => (
        <div key={idx}>{resume.name}</div>
      ))}
      <div className="text-center col-span-2">
        {error && <JobvanaError error={error} />}
      </div>
    </div>
  );
};

export default Resumes;
