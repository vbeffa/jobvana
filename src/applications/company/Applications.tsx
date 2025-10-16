import { Link } from '@tanstack/react-router';
import { useCallback, useContext, useMemo, useState } from 'react';
import { FaArrowUpRightFromSquare, FaCheck, FaEye, FaX } from 'react-icons/fa6';
import { CompanyContext } from '../../Context';
import JobLink from '../../jobs/JobLink';
import JobvanaError from '../../JobvanaError';
import Modal from '../../Modal';
import type { ApplicationStatus } from '../../types';
import ApplicationResume from '../ApplicationResume';
import Status from '../Status';
import StatusSelect from '../StatusSelect';
import useApplications from './useApplications';

const Applications = ({ companyId }: { companyId: number }) => {
  const { company } = useContext(CompanyContext);
  const { applications, isPending, refetch, updateStatus } = useApplications({
    companyId
  });
  const [status, setStatus] = useState<ApplicationStatus | 'all'>('all');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [error, setError] = useState<Error>();

  const filteredApplications = useMemo(
    () =>
      (status !== 'all'
        ? applications?.filter((app) => app.status === status)
        : applications) ?? [],
    [applications, status]
  );

  const onUpdateStatus = useCallback(
    async (applicationId: number, status: 'accepted' | 'declined') => {
      if (!company?.user_id) {
        alert('Missing user id');
        return;
      }

      const message =
        status === 'accepted'
          ? 'Are you sure you want to accept this application? Once accepted, you must commit to at least the first interview round.'
          : 'Are you sure you want to decline this application? Once declined, you can no longer consider this job seeker for this job.';
      if (!confirm(message)) {
        return;
      }

      try {
        setIsSubmitting(true);
        await updateStatus(applicationId, status, company.user_id);
        refetch(); // don't await refetch so the alert displays immediately
        alert(`Application ${status}.`);
      } finally {
        setIsSubmitting(false);
      }
    },
    [company?.user_id, refetch, updateStatus]
  );

  return (
    <>
      <h1>Applications</h1>
      {isSubmitting && <Modal type="updating" />}
      {isPending && <Modal type="loading" />}
      {isDownloading && <Modal type="downloading" />}
      {error && <JobvanaError error={error} />}
      <div className="flex justify-center">
        {!isPending &&
          (applications?.length ? (
            <div className="w-[75%] flex flex-col gap-1">
              <div className="flex w-full justify-end">
                <StatusSelect status={status} onChange={setStatus} />
              </div>
              <table>
                <thead>
                  <tr>
                    <th>Job</th>
                    <th>Job Seeker</th>
                    <th>Applied</th>
                    <th>Status</th>
                    <th>Updated</th>
                    <th className="w-30 min-w-30">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredApplications.map((application, idx) => (
                    <tr
                      key={idx}
                      className={idx % 2 === 1 ? 'bg-gray-200' : ''}
                    >
                      <td>
                        <JobLink {...application.job} />
                      </td>
                      <td>
                        <div className="px-2">
                          {application.jobSeeker.first_name}{' '}
                          {application.jobSeeker.last_name}
                        </div>
                      </td>
                      <td>
                        <div className="flex justify-center px-2">
                          {new Date(
                            application.created_at
                          ).toLocaleDateString()}
                        </div>
                      </td>
                      <td>
                        <div className="px-2">
                          <Status {...application} />
                        </div>
                      </td>
                      <td>
                        <div className="flex justify-center px-2">
                          {application.updated_at &&
                            new Date(
                              application.updated_at
                            ).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="content-center">
                        <div className="flex pl-4 text-blue-400 gap-2">
                          <ApplicationResume
                            resumePath={application.resumePath}
                            setIsDownloading={setIsDownloading}
                            setError={setError}
                          />
                          <Link
                            to="/jobvana/applications/$id"
                            params={{ id: application.id.toString() }}
                          >
                            <FaEye />
                          </Link>
                          {application.status === 'submitted' && (
                            <>
                              <FaCheck
                                className="cursor-pointer"
                                onClick={() =>
                                  onUpdateStatus(application.id, 'accepted')
                                }
                              />
                              <FaX
                                className="cursor-pointer"
                                onClick={() =>
                                  onUpdateStatus(application.id, 'declined')
                                }
                              />
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="mt-4 border-[0.5px] border-blue-400 rounded-lg p-2">
                <div className="flex justify-center font-bold">Notes</div>
                <div className="-mx-2 my-2 border-b-[0.5px] border-blue-300" />
                <div className="flex flex-row gap-1 text-sm">
                  <div className="text-blue-400 content-center">
                    <FaArrowUpRightFromSquare />
                  </div>
                  = open resume for application in new tab
                </div>
                <div className="flex flex-row gap-1 text-sm">
                  <div className="text-blue-400 content-center">
                    <FaEye />
                  </div>
                  = view application details
                </div>
                <div className="flex flex-row gap-1 text-sm">
                  <div className="text-blue-400 content-center">
                    <FaCheck />
                  </div>
                  = accept application
                </div>
                <div className="flex flex-row gap-1 text-sm">
                  <div className="text-blue-400 content-center">
                    <FaX />
                  </div>
                  = decline application
                </div>
              </div>
            </div>
          ) : (
            <div>
              No applications yet. <Link to="/jobvana/jobs">Manage</Link> your
              jobs.
            </div>
          ))}
      </div>
    </>
  );
};

export default Applications;
