import { useCallback, useContext, useMemo, useState } from 'react';
import { FaCheck, FaPerson, FaX } from 'react-icons/fa6';
import ActionMenuContainer from '../../containers/ActionMenuContainer';
import { CompanyContext } from '../../Context';
import JobLink from '../../jobs/JobLink';
import JobvanaError from '../../JobvanaError';
import Modal from '../../Modal';
import Section from '../../Section';
import ApplicationEventsTable from '../ApplicationEventsTable';
import ApplicationResume from '../ApplicationResume';
import InterviewRoundEventsTable from '../InterviewRoundEventsTable';
import InterviewTable from '../InterviewTable';
import JobApplications from '../job_seeker/JobApplications';
import Status from '../Status';
import { updateStatus } from '../utils';
import useApplication from './useApplication';

const ApplicationDetails = ({ id }: { id: number }) => {
  const { company } = useContext(CompanyContext);
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
        setIsUpdating(true);
        await updateStatus(applicationId, status, company.user_id);
        refetch(); // don't await refetch so the alert displays immediately
        alert(`Application ${status}.`);
      } finally {
        setIsUpdating(false);
      }
    },
    [company?.user_id, refetch]
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

  if (!application || !company?.user_id) {
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
          Status:
          <Status {...application} />
        </div>
        {application.status === 'submitted' ? (
          <div className="flex flex-row gap-1 items-center">
            <FaCheck
              className="cursor-pointer hover:text-blue-400"
              onClick={() => onUpdateStatus(application.id, 'accepted')}
            />
            <FaX
              className="cursor-pointer hover:text-blue-400"
              onClick={() => onUpdateStatus(application.id, 'declined')}
            />
          </div>
        ) : undefined}
      </ActionMenuContainer>
      <div className="px-4 mt-2">
        <Section title={`Application ID: ${application.id}`}>
          <div className="flex flex-row">
            <div className="w-[60%]">
              <div className="flex flex-row">
                <div className="w-24">Job Seeker:</div>
                <div className="flex flex-row items-center">
                  <FaPerson />
                  {application.jobSeeker.name}
                </div>
              </div>
              <div className="flex flex-row">
                {/* min-w to keep job title from overflowing into left div */}
                <div className="min-w-24">Job:</div>
                <div className="truncate pr-2">
                  <JobLink {...application.job} />
                </div>
              </div>
              <div className="flex flex-row">
                <div className="w-24">Submitted:</div>
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
                userType="company"
                userId={company.user_id}
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
                      userId={company.user_id}
                      jobSeekerName={application.jobSeeker.name}
                      company={company}
                    />
                  </div>
                ) : (
                  'No events yet.'
                )}
              </div>
            </div>
          ) : application.status === 'submitted' ? (
            'Pending until you accept the application.'
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
                company={company}
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
