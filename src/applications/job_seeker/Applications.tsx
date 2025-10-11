import { Link } from '@tanstack/react-router';
import _ from 'lodash';
import { useCallback, useContext, useState } from 'react';
import {
  FaArrowUpRightFromSquare,
  FaEye,
  FaFileCircleXmark
} from 'react-icons/fa6';
import CompanyLink from '../../companies/CompanyLink';
import { JobSeekerContext } from '../../Context';
import supabase from '../../db/supabase';
import JobLink from '../../jobs/JobLink';
import JobvanaError from '../../JobvanaError';
import Modal from '../../Modal';
import ApplicationResume from '../ApplicationResume';
import JobApplications from './JobApplications';
import useApplications from './useApplications';

const Applications = ({ jobSeekerId }: { jobSeekerId: number }) => {
  const { jobSeeker } = useContext(JobSeekerContext);
  const { applications, isPending, refetch } = useApplications({
    jobSeekerId
  });
  const [doRefetch, setDoRefetch] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [error, setError] = useState<Error>();

  const onWithdraw = useCallback(
    async (applicationId: number) => {
      if (!jobSeeker?.user_id) {
        alert('Missing user id');
        return;
      }

      if (!confirm('Are you sure you want to withdraw this application?')) {
        return;
      }

      try {
        setIsSubmitting(true);
        const { error } = await supabase
          .from('applications')
          .update({
            status: 'withdrawn',
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
            user_id: jobSeeker.user_id,
            event: 'withdrawn'
          });
        if (error2) {
          console.log(error2);
          setError(error2);
          return;
        }

        setDoRefetch(applicationId);
        alert('Application withdrawn.');
        await refetch();
      } finally {
        setIsSubmitting(false);
        setDoRefetch(0);
      }
    },
    [jobSeeker?.user_id, refetch]
  );

  return (
    <>
      {/* <h1>My Applications</h1> */}
      {isSubmitting && <Modal type="updating" />}
      {isPending && <Modal type="loading" />}
      {isDownloading && <Modal type="downloading" />}
      {error && <JobvanaError error={error} />}
      <div className="flex justify-center mt-8">
        {!isPending && (
          <div className="w-3/4 flex flex-col gap-1">
            <table>
              <thead>
                <tr>
                  <th className="min-w-[15%]">Company</th>
                  <th className="min-w-[25%]">Job</th>
                  <th>Applied</th>
                  <th>Status</th>
                  <th className="whitespace-nowrap">Applications*</th>
                  <th className="w-[12%] min-w-32">Actions</th>
                </tr>
              </thead>
              <tbody>
                {applications?.map((application, idx) => (
                  <tr key={idx} className={idx % 2 === 1 ? 'bg-gray-200' : ''}>
                    <td className="whitespace-nowrap">
                      <CompanyLink {...application.company} />
                    </td>
                    <td className="whitespace-nowrap">
                      <JobLink {...application.job} />
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
                        {(application.status === 'submitted' ||
                          application.status === 'accepted') && (
                          <FaFileCircleXmark
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
              <div className="content-center">* Applications</div>
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
                <FaFileCircleXmark />
              </div>
              = withdraw application
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
