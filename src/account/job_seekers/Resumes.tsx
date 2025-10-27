import { StorageError } from '@supabase/storage-js';
import { useCallback, useContext, useMemo, useRef, useState } from 'react';
import { FaCheckCircle } from 'react-icons/fa';
import { FaCheck, FaDownload, FaTrash } from 'react-icons/fa6';
import { JobSeekerContext, type JobSeeker } from '../../Context';
import Button from '../../controls/Button';
import useJobSeeker from '../../job_seekers/useJobSeeker';
import useResumes from '../../job_seekers/useResumes';
import JobvanaError from '../../JobvanaError';
import Modal from '../../Modal';

export type ResumeProps = {
  jobSeeker: JobSeeker;
};

const Resumes = ({ jobSeeker }: ResumeProps) => {
  const { resumes, isPending, upload, download, deleteResume, error, refetch } =
    useResumes(jobSeeker.user_id);
  const { setJobSeeker } = useContext(JobSeekerContext);
  const { updateJobSeeker } = useJobSeeker();

  const ref = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);

  const [storageError, setStorageError] = useState<Error>();
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const activeResume = useMemo(() => {
    if (!jobSeeker.active_resume_id) {
      return undefined;
    }
    return resumes?.find((resume) => resume.id === jobSeeker.active_resume_id);
  }, [jobSeeker.active_resume_id, resumes]);

  const setActive = useCallback(
    async ({ id, name }: { id?: string; name?: string }) => {
      const resumeId =
        id ?? resumes?.find((resume) => resume.name === name)?.id;
      if (!resumeId) {
        return;
      }
      const toUpdate: JobSeeker = {
        ...jobSeeker,
        active_resume_id: resumeId
      };
      if (!id) {
        setIsUpdating(true);
      }
      setStorageError(undefined);
      try {
        const updated = await updateJobSeeker(toUpdate);
        setJobSeeker(updated);
      } catch (err) {
        setStorageError(err as Error);
      } finally {
        setIsUpdating(false);
      }
    },
    [jobSeeker, resumes, setJobSeeker, updateJobSeeker]
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const doUpload = useCallback(async () => {
    if (!file) {
      alert('No file found!');
      return;
    }

    let replace = false;
    if (resumes?.find((resume) => resume.name.localeCompare(file.name) === 0)) {
      if (!confirm(`Resume ${file.name} already exists. Replace?`)) {
        return;
      }
      replace = true;
    }

    setIsUploading(true);
    setStorageError(undefined);
    try {
      const { data, error } = await upload(file, replace);
      if (data) {
        await setActive({ id: data.id });
      }
      if (error) {
        setStorageError(error);
      } else {
        console.log(data);
        alert(`Uploaded ${file.name}`);
        await refetch();
      }
    } finally {
      if (ref.current) {
        ref.current.value = '';
      }
      setIsUploading(false);
      setFile(null);
    }
  }, [file, refetch, resumes, setActive, upload]);

  const doDownload = useCallback(
    async (name: string) => {
      setIsDownloading(true);
      setStorageError(undefined);
      try {
        const { data, error } = await download(name);
        if (error) {
          setStorageError(error);
        } else if (!data) {
          setStorageError(new StorageError('Could not download resume'));
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

  const doDelete = useCallback(
    async (name: string) => {
      if (activeResume?.name === name && resumes && resumes.length > 1) {
        alert(
          'This resume is active. Please set another one before deleting this one.'
        );
        return;
      }

      if (!confirm(`Are you sure you want to delete ${name}?`)) {
        return;
      }

      setIsDeleting(true);
      setStorageError(undefined);
      try {
        const { data, error } = await deleteResume(name);
        if (error) {
          setStorageError(error);
        } else if (data?.length) {
          alert(`Deleted ${data[0].name}`);
          await refetch();
        } else {
          setStorageError(new StorageError('Could not delete resume'));
        }
      } finally {
        setIsDeleting(false);
      }
    },
    [activeResume?.name, deleteResume, refetch, resumes]
  );

  return (
    <>
      {isPending && <Modal type="loading" />}
      {isUpdating && <Modal type="updating" />}
      {isDownloading && <Modal type="downloading" />}
      {isUploading && <Modal type="uploading" />}
      {isDeleting && <Modal type="deleting" />}
      <div className="h-full overflow-auto">
        <div className="px-4 pt-4 flex flex-col gap-2">
          <div className="flex justify-between">
            <div className="content-center">Your resumes:</div>
          </div>
          <table>
            <thead>
              <tr>
                <th className="w-1/2">Name</th>
                <th className="w-3/10">Modified</th>
                <th className="w-1/5">Actions</th>
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
                    <td>
                      <div className="flex justify-between">
                        {resume.name}
                        {jobSeeker.active_resume_id === resume.id && (
                          <div className="text-blue-400 content-center">
                            <FaCheckCircle />
                          </div>
                        )}
                      </div>
                    </td>
                    <td>
                      <div className="flex justify-center">
                        {new Date(resume.updated_at).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="content-center">
                      <div
                        className={`flex ${resumes.length > 1 ? 'justify-end pr-[25%]' : 'justify-center'} text-blue-400 gap-2`}
                      >
                        {jobSeeker.active_resume_id !== resume.id && (
                          <FaCheck
                            className="cursor-pointer"
                            onClick={() => setActive({ name: resume.name })}
                          />
                        )}
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
          <div className="flex flex-row gap-2">
            <input
              id="file_input"
              type="file"
              ref={ref}
              accept="application/pdf"
              className="pl-1 text-sm border-[0.5px] border-blue-400 content-center"
              onChange={handleFileChange}
            />
            <Button
              label="Upload"
              disabled={file === null}
              onClick={doUpload}
            />
          </div>
          <div className="flex flex-col">
            Notes:
            <div className="flex flex-row gap-1 text-sm">
              <div className="text-blue-400 content-center">
                <FaCheckCircle />
              </div>
              = active resume
            </div>
            <div className="flex flex-row gap-1 text-sm">
              <div className="text-blue-400 content-center">
                <FaCheck />
              </div>
              = inactive resume; click to make active
            </div>
          </div>
          <div className="text-center col-span-2">
            {error && <JobvanaError error={error} />}
            {storageError && <JobvanaError error={storageError} />}
          </div>
        </div>
      </div>
    </>
  );
};

export default Resumes;
