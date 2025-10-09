import { StorageError } from '@supabase/storage-js';
import {
  useCallback,
  useState,
  type Dispatch,
  type SetStateAction
} from 'react';
import { FaDownload } from 'react-icons/fa6';
import useApplicationResume from '../job_seekers/useApplicationResume';
import Modal from '../Modal';

export type ApplicationResumeProps = {
  jobId: number;
  resumePath: string;
  setError: Dispatch<SetStateAction<Error | undefined>>;
};

const ApplicationResume = ({
  jobId,
  resumePath,
  setError
}: ApplicationResumeProps) => {
  const { resume, download } = useApplicationResume(jobId, resumePath);

  const [isDownloading, setIsDownloading] = useState(false);

  const doDownload = useCallback(async () => {
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
        link.download = `job_id_${jobId}_resume.pdf`;
        link.click();
        window.URL.revokeObjectURL(link.href);
      }
    } finally {
      setIsDownloading(false);
    }
  }, [download, jobId, setError]);
  if (!resume) {
    return null;
  }

  return (
    <>
      {isDownloading && <Modal type="downloading" />}
      <div className="flex justify-center text-blue-400">
        <FaDownload className="cursor-pointer" onClick={doDownload} />
      </div>
    </>
  );
};

export default ApplicationResume;
