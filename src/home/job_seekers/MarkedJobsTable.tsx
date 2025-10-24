import { useCallback, useState } from 'react';
import { FaEye, FaTrash, FaX } from 'react-icons/fa6';
import CompanyLink from '../../companies/CompanyLink';
import { permanentlyHide, unhide, unsave } from '../../jobs/job_seekers/utils';
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
    async (id: number, action?: 'delete') => {
      if (
        type === 'saved' &&
        !confirm(
          'Are you sure you want to remove this saved job? You will need to find it again on the Jobs page.'
        )
      ) {
        return;
      }
      if (
        action &&
        !confirm(
          'Are you sure you wish to permanently delete this job? You will no longer be able to find it in searches or view it in this table.'
        )
      ) {
        return;
      }

      setIsUpdating(true);
      setUpdateError(undefined);
      try {
        await (type === 'saved'
          ? unsave(id, jobSeekerId)
          : action === 'delete'
            ? permanentlyHide(id, jobSeekerId)
            : unhide(id, jobSeekerId));
        onAction();
        alert(type === 'saved' ? 'Job unsaved.' : 'Job unhidden.');
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
    <div>
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
                <div className="flex flex-row items-center gap-1 justify-center text-blue-500">
                  {type === 'saved' && <FaX onClick={() => onClick(job.id)} />}
                  {type === 'hidden' && (
                    <>
                      <FaEye
                        className="hover:text-blue-400 cursor-pointer"
                        onClick={() => onClick(job.id)}
                      />
                      <FaTrash
                        className="hover:text-blue-400 cursor-pointer"
                        onClick={() => onClick(job.id, 'delete')}
                      />
                    </>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MarkedJobsTable;
