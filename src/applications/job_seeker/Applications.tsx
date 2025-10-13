import { Link } from '@tanstack/react-router';
import { useCallback, useContext, useMemo, useState } from 'react';
import { FaArrowUpRightFromSquare, FaEye, FaX } from 'react-icons/fa6';
import CompanyLink from '../../companies/CompanyLink';
import { JobSeekerContext } from '../../Context';
import JobLink from '../../jobs/JobLink';
import JobvanaError from '../../JobvanaError';
import Modal from '../../Modal';
import type { ApplicationStatus } from '../../types';
import ApplicationResume from '../ApplicationResume';
import Status from '../Status';
import StatusSelect from '../StatusSelect';
import JobApplications from './JobApplications';
import useApplications from './useApplications';

const Applications = ({ jobSeekerId }: { jobSeekerId: number }) => {
  const { jobSeeker } = useContext(JobSeekerContext);
  const { applications, isPending, refetch, updateStatus } = useApplications({
    jobSeekerId
  });
  const [doRefetch, setDoRefetch] = useState(0); // update applications count when application is withdrawn
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

  const onWithdraw = useCallback(
    async (applicationId: number) => {
      if (!jobSeeker?.user_id) {
        alert('Missing user id');
        return;
      }

      if (
        !confirm(
          'Are you sure you want to withdraw this application? If you withdraw it, you will not be able to reapply to this job.'
        )
      ) {
        return;
      }

      try {
        setIsSubmitting(true);
        await updateStatus(applicationId, 'withdrawn', jobSeeker.user_id);
        setDoRefetch(applicationId);
        refetch(); // don't await refetch so the alert displays immediately
        alert('Application withdrawn.');
      } finally {
        setIsSubmitting(false);
        setDoRefetch(0);
      }
    },
    [jobSeeker?.user_id, refetch, updateStatus]
  );

  return (
    <>
      <h1>My Applications</h1>
      {isSubmitting && <Modal type="updating" />}
      {isPending && <Modal type="loading" />}
      {isDownloading && <Modal type="downloading" />}
      {error && <JobvanaError error={error} />}
      <div className="flex justify-center">
        {!isPending && (
          <div className="w-fit flex flex-col gap-1">
            <table>
              <thead>
                <tr>
                  <th colSpan={6} className="filter">
                    <div className="flex w-full justify-end">
                      <StatusSelect status={status} onChange={setStatus} />
                    </div>
                  </th>
                </tr>
                <tr>
                  <th className="min-w-[15%]">Company</th>
                  <th className="min-w-[25%]">Job</th>
                  <th>Applied</th>
                  <th className="w-[10%] max-w-12">Status</th>
                  <th>Applications</th>
                  <th className="w-[12%] min-w-32">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredApplications.map((application, idx) => (
                  <tr key={idx} className={idx % 2 === 1 ? 'bg-gray-200' : ''}>
                    <td className="whitespace-nowrap">
                      <CompanyLink {...application.company} />
                    </td>
                    <td className="whitespace-nowrap">
                      <JobLink {...application.job} />
                    </td>
                    <td>
                      <div className="flex justify-center px-2">
                        {new Date(application.created_at).toLocaleDateString()}
                      </div>
                    </td>
                    <td>
                      <div className="px-2">
                        <Status {...application} />
                      </div>
                    </td>
                    <td>
                      <JobApplications
                        jobId={application.job_id}
                        jobInterviewProcess={application.interview_process}
                        doRefetch={doRefetch === application.id}
                      />
                    </td>
                    <td className="content-center">
                      <div className="flex justify-left pl-[25%] text-blue-400 gap-2">
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
                          <FaX
                            className="cursor-pointer"
                            onClick={() => onWithdraw(application.id)}
                          />
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div>Notes:</div>
            <div className="flex flex-row text-sm gap-2">
              <div className="content-center">Applications</div>
              <div className="content-center">=</div>
              <div>
                <div className="border-b-[0.5px]">
                  Number of submitted or accepted applications for job
                </div>
                <div className="border-t-[0.5px] flex justify-center">
                  Job pipeline size
                </div>
              </div>
            </div>
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
                <FaX />
              </div>
              = withdraw application
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Applications;
