import { useCallback, useState } from 'react';
import { FaEyeSlash, FaX } from 'react-icons/fa6';
import CompanyLink from '../../companies/CompanyLink';
import { unhide, unsave } from '../../jobs/job_seekers/utils';
import JobLink from '../../jobs/JobLink';
import JobvanaError from '../../JobvanaError';
import Modal from '../../Modal';
import type { Job } from './useMarkedJobs';

const MarkedJobsTable = ({
  jobSeekerId,
  jobs,
  type,
  onAction
}: {
  jobSeekerId: number;
  jobs: Array<Job>;
  type: 'saved' | 'hidden';
  onAction: () => void;
}) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateError, setUpdateError] = useState<Error>();

  const onClick = useCallback(
    async (id: number) => {
      if (
        type === 'saved' &&
        !confirm(
          'Are you sure you want to remove this saved job? You will need to find it again on the Jobs page.'
        )
      ) {
        return;
      }

      setIsUpdating(true);
      setUpdateError(undefined);
      try {
        await (type === 'saved'
          ? unsave(id, jobSeekerId)
          : unhide(id, jobSeekerId));
        onAction();
        alert('Job hidden.');
      } catch (err) {
        console.log(err);
        setUpdateError(err as Error);
      } finally {
        setIsUpdating(false);
      }
    },
    [jobSeekerId, onAction, type]
  );

  return (
    <>
      {isUpdating && <Modal type="updating" />}
      {updateError && <JobvanaError error={updateError} />}
      <table className="w-full">
        <thead>
          <tr>
            <th>Company</th>
            <th>Title</th>
            <th>Posted</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {jobs.map((job, idx) => (
            <tr key={idx} className={idx % 2 === 1 ? 'bg-gray-200' : ''}>
              <td>
                <div className="px-2">
                  <CompanyLink id={job.company_id} name={job.companyName} />
                </div>
              </td>
              <td>
                <div className="px-2">
                  <JobLink {...job} />
                </div>
              </td>
              <td>
                <div className="flex justify-center">
                  {new Date(job.created_at).toLocaleDateString()}
                </div>
              </td>
              <td>
                <div
                  className="flex flex-row items-center gap-1 justify-center text-blue-500 hover:text-blue-400 cursor-pointer"
                  onClick={() => onClick(job.id)}
                >
                  {type === 'saved' && <FaX />}
                  {type === 'hidden' && <FaEyeSlash />}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default MarkedJobsTable;
