import { Link } from '@tanstack/react-router';
import { useCallback, useContext, useMemo, useState } from 'react';
import { FaArrowUpRightFromSquare, FaCheck, FaEye, FaX } from 'react-icons/fa6';
import { CompanyContext } from '../../Context';
import supabase from '../../db/supabase';
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
  const { applications, isPending, refetch } = useApplications({
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

  const updateStatus = useCallback(
    async (applicationId: number, status: ApplicationStatus) => {
      if (!company?.user_id) {
        alert('Missing user id');
        return;
      }

      const action = status === 'accepted' ? 'accept' : 'decline';
      if (!confirm(`Are you sure you want to ${action} this application?`)) {
        return;
      }

      try {
        setIsSubmitting(true);
        const { error } = await supabase
          .from('applications')
          .update({
            status,
            updated_at: new Date().toISOString()
          })
          .eq('id', applicationId);

        if (error) {
          console.log(error);
          setError(error);
          return;
        }

        const { error: error2 } = await supabase
          .from('application_events')
          .insert({
            application_id: applicationId,
            user_id: company.user_id,
            event: status
          });
        if (error2) {
          console.log(error2);
          setError(error2);
          return;
        }

        alert(`Application ${status}.`);
        await refetch();
      } finally {
        setIsSubmitting(false);
      }
    },
    [company?.user_id, refetch]
  );

  return (
    <>
      <h1>Applications</h1>
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
                  <th className="min-w-[25%]">Job</th>
                  <th className="min-w-[15%] whitespace-nowrap">Job Seeker</th>
                  <th>Applied</th>
                  <th className="w-[10%] max-w-12">Status</th>
                  <th>Updated</th>
                  <th className="w-[12%] min-w-32">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredApplications.map((application, idx) => (
                  <tr key={idx} className={idx % 2 === 1 ? 'bg-gray-200' : ''}>
                    <td className="whitespace-nowrap">
                      <JobLink {...application.job} />
                    </td>
                    <td>
                      <div className="px-2 whitespace-nowrap">
                        {application.jobSeeker.first_name}{' '}
                        {application.jobSeeker.last_name}
                      </div>
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
                      <div className="flex justify-center px-2">
                        {application.updated_at &&
                          new Date(application.updated_at).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="content-center">
                      <div className="flex justify-start pl-[20%] text-blue-400 gap-2">
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
                          <FaCheck
                            className="cursor-pointer"
                            onClick={() =>
                              updateStatus(application.id, 'accepted')
                            }
                          />
                        )}
                        {(application.status === 'submitted' ||
                          application.status === 'accepted') && (
                          <FaX
                            className="cursor-pointer"
                            onClick={() =>
                              updateStatus(application.id, 'declined')
                            }
                          />
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div>Notes:</div>
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
        )}
      </div>
    </>
  );
};

export default Applications;
