import { StorageError } from '@supabase/storage-js';
import { useCallback, type Dispatch, type SetStateAction } from 'react';
import { FaArrowUpRightFromSquare } from 'react-icons/fa6';
import useApplicationResume from '../job_seekers/useApplicationResume';

export type ApplicationResumeProps = {
  resumePath: string;
  setIsDownloading: Dispatch<SetStateAction<boolean>>;
  setError: Dispatch<SetStateAction<Error | undefined>>;
};

const ApplicationResume = ({
  resumePath,
  setIsDownloading,
  setError
}: ApplicationResumeProps) => {
  const { resume, download } = useApplicationResume({ resumePath });

  const doDownload = useCallback(async () => {
    if (!resume) {
      setError(Error('resume is undefined'));
      return;
    }
    setIsDownloading(true);
    setError(undefined);
    try {
      const { data, error } = await download();
      if (error) {
        setError(error);
      } else if (!data) {
        setError(new StorageError('Could not download resume'));
      } else {
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(data);
        link.target = '_blank';
        // link.download = `job_id_${jobId}_resume.pdf`;
        link.title = `job_id_${resume.name}_resume.pdf`;
        link.click();
        window.URL.revokeObjectURL(link.href);
      }
    } finally {
      setIsDownloading(false);
    }
  }, [download, resume, setError, setIsDownloading]);

  if (!resume) {
    return null;
  }

  return (
    <>
      <div className="flex justify-center text-blue-400">
        <FaArrowUpRightFromSquare
          className="cursor-pointer"
          onClick={doDownload}
        />
      </div>
    </>
  );
};

export default ApplicationResume;
