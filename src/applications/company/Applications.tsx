import _ from 'lodash';
import { useCallback, useState } from 'react';
import { FaCheck, FaDownload, FaEye, FaX } from 'react-icons/fa6';
import supabase from '../../db/supabase';
import JobLink from '../../jobs/JobLink';
import JobvanaError from '../../JobvanaError';
import Modal from '../../Modal';
import type { Application } from '../../types';
import ApplicationResume from '../job_seeker/ApplicationResume';
import useApplicationsForCompany from './useApplicationsForCompany';

const Applications = ({ companyId }: { companyId: number }) => {
  const { applications, isPending, refetch } = useApplicationsForCompany({
    companyId
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<Error>();

  const updateStatus = useCallback(
    async (applicationId: number, status: Application['status']) => {
      if (!confirm('Are you sure you want to decline this application?')) {
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
        } else {
          await refetch();
          alert('Application declined.');
        }
      } finally {
        setIsSubmitting(false);
      }
    },
    [refetch]
  );

  return (
    <>
      <h1>Applications</h1>
      {isSubmitting && <Modal type="updating" />}
      {isPending && <Modal type="loading" />}
      {error && <JobvanaError error={error} />}
      <div className="flex justify-center">
        {!isPending && (
          <div className="w-3/4 flex flex-col gap-1">
            <table>
              <thead>
                <tr>
                  <th className="min-w-[25%]">Job</th>
                  <th className="min-w-[15%] whitespace-nowrap">Job Seeker</th>
                  <th>Applied</th>
                  <th>Status</th>
                  <th>Updated</th>
                  <th className="w-[12%] min-w-32">Actions</th>
                </tr>
              </thead>
              <tbody>
                {applications?.map((application, idx) => (
                  <tr key={idx} className={idx % 2 === 1 ? 'bg-gray-200' : ''}>
                    <td className="whitespace-nowrap">
                      <JobLink {...application.job} />
                    </td>
                    <td className="whitespace-nowrap">
                      {application.jobSeeker.first_name}{' '}
                      {application.jobSeeker.last_name}
                    </td>
                    <td>
                      <div className="flex justify-center">
                        {new Date(application.created_at).toLocaleDateString()}
                      </div>
                    </td>
                    <td>
                      <div className="flex justify-center">
                        {_.capitalize(application.status)}
                      </div>
                    </td>
                    <td>
                      <div className="flex justify-center">
                        {application.updated_at &&
                          new Date(application.updated_at).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="content-center">
                      <div className="flex justify-start pl-[20%] text-blue-400 gap-2">
                        <ApplicationResume
                          jobId={application.job_id}
                          resumePath={application.resume_path}
                          setError={setError}
                        />
                        <FaEye className="cursor-pointer" />
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
                <FaDownload />
              </div>
              = download resume for application
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
      {/* <div className="flex flex-row gap-x-2">
        <div className="w-[20%]">
          {applications?.map((application, idx) => (
            <SummaryCard
              key={application.id}
              selected={applicationId === application.id}
              onClick={() => setApplicationId(application.id)}
              title={application.job.title}
              text=""
              // text={`${application.jobSeeker.user.first_name} ${application.jobSeeker.user.last_name}`}
              borderBottom={idx < applications.length - 1}
            />
          ))}
        </div>
        <div className="w-[80%]">
          {applicationId && <ApplicationDetails id={applicationId} />}
        </div>
      </div> */}
    </>
  );
};

export default Applications;
