import { useCallback, useContext, useMemo, useState } from 'react';
import { FaPaperPlane, FaX } from 'react-icons/fa6';
import CompanyLink from '../../companies/CompanyLink';
import ActionMenuContainer from '../../containers/ActionMenuContainer';
import { JobSeekerContext } from '../../Context';
import JobLink from '../../jobs/JobLink';
import JobvanaError from '../../JobvanaError';
import Modal from '../../Modal';
import Section from '../../Section';
import ApplicationEventsTable from '../ApplicationEventsTable';
import ApplicationResume from '../ApplicationResume';
import InterviewRoundEventsTable from '../InterviewRoundEventsTable';
import InterviewTable from '../InterviewTable';
import Status from '../Status';
import { updateStatus } from '../utils';
import JobApplications from './JobApplications';
import useApplication from './useApplication';

const ApplicationDetails = ({ id }: { id: number }) => {
  const { jobSeeker } = useContext(JobSeekerContext);
  const {
    application,
    isPending,
    isPlaceholderData,
    error: applicationError,
    refetch
  } = useApplication({ id });

  const [isUpdating, setIsUpdating] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [resumeError, setResumeError] = useState<Error>();

  const error = useMemo(
    () => applicationError ?? resumeError,
    [applicationError, resumeError]
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
        setIsUpdating(true);
        await updateStatus(applicationId, 'withdrawn', jobSeeker.user_id);
        refetch(); // don't await refetch so the alert displays immediately
        alert('Application withdrawn.');
      } finally {
        setIsUpdating(false);
      }
    },
    [jobSeeker?.user_id, refetch]
  );

  if (error) {
    return <JobvanaError error={error} />;
  }

  if (isPending) {
    return (
      <div className="relative top-10">
        <Modal type="loading" />
      </div>
    );
  }

  if (!application || !jobSeeker) {
    return null;
  }

  return (
    <>
      <div className="relative top-10">
        {isPlaceholderData ? <Modal type="loading" /> : null}
        {isDownloading ? <Modal type="downloading" /> : null}
        {isUpdating ? <Modal type="updating" /> : null}
      </div>
      <ActionMenuContainer>
        <div className="flex flex-row gap-1 items-center text-sm">
          <FaPaperPlane />
          Application ID: {application.id}
          <div className="h-fit py-2 mx-1 border-r-[1.5px]" />
          Interview Status:
          <Status status={application.interviewStatus} />
        </div>
        {application.status === 'submitted' ? (
          <div className="flex items-center">
            <FaX
              className="cursor-pointer hover:text-blue-400"
              onClick={() => onWithdraw(application.id)}
            />
          </div>
        ) : undefined}
      </ActionMenuContainer>
      <div className="h-full px-4 pb-6 pt-2 overflow-auto">
        <Section title="Details">
          <div className="flex flex-row">
            <div className="w-[60%]">
              <div className="flex flex-row">
                <div className="w-22">Company:</div>
                <CompanyLink {...application.company} />
              </div>
              <div className="flex flex-row">
                {/* min-w to keep job title from overflowing into left div */}
                <div className="min-w-22">Job:</div>
                <div className="truncate pr-2">
                  <JobLink {...application.job} />
                </div>
              </div>
              <div className="flex flex-row">
                <div className="w-22">Submitted:</div>
                {new Date(application.created_at).toLocaleDateString()}
              </div>
            </div>
            <div className="w-[40%]">
              <div className="flex flex-row">
                <div className="w-26">Applications:</div>
                <JobApplications
                  jobId={application.job.id}
                  jobInterviewProcess={application.interviewProcess}
                  doRefetch={false}
                />
              </div>
              <div className="flex flex-row items-center">
                <div className="w-26">Resume:</div>
                <ApplicationResume
                  resumePath={application.resumePath}
                  setIsDownloading={setIsDownloading}
                  setError={setResumeError}
                />
              </div>
            </div>
          </div>
        </Section>

        <Section title="Interview Rounds">
          {application.interview ? (
            <div className="flex flex-col gap-2 pt-1">
              <InterviewTable
                interviewProcess={application.interviewProcess}
                interview={application.interview}
                userType="job_seeker"
                userId={jobSeeker.user_id}
                onUpdate={() => {
                  refetch();
                }}
              />
              <div>
                <h2>History</h2>
                {application.interview.events.length ? (
                  <div className="pt-1">
                    <InterviewRoundEventsTable
                      events={application.interview.events}
                      userId={jobSeeker.user_id}
                      jobSeekerName={application.jobSeeker.name}
                      company={application.company}
                    />
                  </div>
                ) : (
                  'No events'
                )}
              </div>
            </div>
          ) : application.status === 'submitted' ? (
            'Pending until the company accepts the application.'
          ) : (
            `Application is ${application.status}`
          )}
        </Section>

        <Section title="Application History" isLast={true}>
          <div className="pt-1">
            {application.events.length ? (
              <ApplicationEventsTable
                events={application.events}
                jobSeekerName={application.jobSeeker.name}
                company={application.company}
              />
            ) : (
              'No events'
            )}
          </div>
        </Section>
      </div>
    </>
  );
};

export default ApplicationDetails;
