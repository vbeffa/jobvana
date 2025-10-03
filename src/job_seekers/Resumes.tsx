import { StorageError } from '@supabase/storage-js';
import { useCallback, useState } from 'react';
import { FaDownload, FaTrash } from 'react-icons/fa6';
import type { JobSeeker } from '../Context';
import Button from '../controls/Button';
import JobvanaError from '../JobvanaError';
import LoadingModal from '../LoadingModal';
import useResumes from './useResumes';

export type ResumeProps = {
  jobSeeker: JobSeeker;
};

const Resumes = ({ jobSeeker }: ResumeProps) => {
  const { resumes, isPending, download, deleteResume, error, refetch } =
    useResumes(jobSeeker.user_id);
  const [deleteError, setDeleteError] = useState<StorageError>();
  const [isDownloading, setIsDownloading] = useState(false);

  const doDelete = useCallback(
    async (name: string) => {
      if (!confirm('Are you sure you want to delete this resume?')) {
        return;
      }
      const { data, error } = await deleteResume(name);
      if (error) {
        setDeleteError(error);
      } else if (data?.length) {
        alert(`Deleted ${data[0].name}`);
        await refetch();
      } else {
        setDeleteError(new StorageError('Could not delete resume'));
      }
    },
    [deleteResume, refetch]
  );

  const doDownload = useCallback(
    async (name: string) => {
      setIsDownloading(true);
      try {
        const { data, error } = await download(name);
        if (error) {
          setDeleteError(error);
        } else if (!data) {
          setDeleteError(new StorageError('Could not download resume'));
        } else {
          const link = document.createElement('a');
          link.href = window.URL.createObjectURL(data);
          link.download = name;
          link.click();
          window.URL.revokeObjectURL(link.href);
        }
      } finally {
        setIsDownloading(false);
      }
    },
    [download]
  );

  // console.log(resumes);

  return (
    <div className="flex flex-col gap-2">
      {isPending && <LoadingModal />}
      <div className="flex justify-between">
        <div className="content-center">Your resumes:</div>
        <Button label="Add" onClick={() => {}} />
      </div>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Modified</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {resumes
            ?.sort(
              (r1, r2) =>
                new Date(r2.updated_at).getTime() -
                new Date(r1.updated_at).getTime()
            )
            .map((resume, idx) => (
              <tr key={idx} className={idx % 2 === 1 ? 'bg-gray-200' : ''}>
                <td>{resume.name}</td>
                <td>{resume.updated_at}</td>
                <td className="content-center">
                  <div className="flex justify-center text-blue-400 gap-2">
                    <FaDownload
                      className="cursor-pointer"
                      onClick={() => doDownload(resume.name)}
                    />
                    <FaTrash
                      className="cursor-pointer"
                      onClick={() => doDelete(resume.name)}
                    />
                  </div>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
      <div className="text-center col-span-2">
        {error && <JobvanaError error={error} />}
        {isDownloading && <>Downloading...</>}
        {deleteError && <JobvanaError error={deleteError} />}
      </div>
    </div>
  );
};

export default Resumes;
