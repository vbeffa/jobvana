import { useCallback, useContext, useMemo, useState } from 'react';
import { FaCheck, FaPerson, FaX } from 'react-icons/fa6';
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
import useApplicationEvents from '../useApplicationEvents';
import useInterview from '../useInterview';
import useInterviewRoundEvents from '../useInterviewRoundEvents';
import { updateStatus } from '../utils';
import useApplication from './useApplication';

const ApplicationDetails = ({ id }: { id: number }) => {
  const { company } = useContext(CompanyContext);
  const {
    application,
    isPending,
    isPlaceholderData,
    error: applicationError,
    refetch: refetchApplication
  } = useApplication({ id });
  const { events: applicationEvents, refetch: refetchApplicationEvents } =
    useApplicationEvents({
      applicationId: id
    });
  const { interview, refetch: refetchInterview } = useInterview({
    applicationId: id
  });
  const { events: interviewRoundEvents, refetch: refetchInterviewRoundEvents } =
    useInterviewRoundEvents({
      interviewId: interview?.id
    });

  const [isUpdating, setIsUpdating] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [resumeError, setResumeError] = useState<Error>();

  const error = useMemo(
    () => applicationError ?? resumeError,
    [applicationError, resumeError]
  );

  const refetch = useCallback(() => {
    Promise.all([
      refetchApplication(),
      refetchApplicationEvents(),
      refetchInterview(),
      refetchInterviewRoundEvents()
    ]);
  }, [
    refetchApplication,
    refetchApplicationEvents,
    refetchInterview,
    refetchInterviewRoundEvents
  ]);

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
    return <Modal type="loading" />;
  }

  if (!application || !company?.user_id) {
    return null;
  }

  return (
    <>
      {isPlaceholderData ? <Modal type="loading" /> : null}
      {isDownloading ? <Modal type="downloading" /> : null}
      {isUpdating ? <Modal type="updating" /> : null}
      <Section
        title={
          <div className="flex justify-between">
            <div>Application</div>
            <div>
              <Status {...application} />
            </div>
          </div>
        }
      >
        <div className="flex flex-row">
          <div className="w-[60%]">
            <div className="flex flex-row">
              <div className="w-24">Job Seeker:</div>
              <div className="flex flex-row items-center">
                <FaPerson />
                {application.jobSeeker.first_name}{' '}
                {application.jobSeeker.last_name}
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
            <div className="flex flex-row items-center">
              <div className="w-26">Actions:</div>
              {application.status === 'submitted' && (
                <div className="flex flex-row gap-1">
                  <FaCheck
                    className="text-blue-400 cursor-pointer"
                    onClick={() => onUpdateStatus(application.id, 'accepted')}
                  />
                  <FaX
                    className="text-blue-400 cursor-pointer"
                    onClick={() => onUpdateStatus(application.id, 'declined')}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </Section>

      <Section title="Interview Rounds">
        {application.interviewProcess && interview ? (
          <div className="flex flex-col gap-2">
            <InterviewTable
              interviewProcess={application.interviewProcess}
              interview={interview}
              userType="company"
              userId={company.user_id}
              onUpdate={() => {
                refetchApplication();
                refetchInterview();
                refetchInterviewRoundEvents();
              }}
            />
            {interviewRoundEvents?.length ? (
              <div>
                <h2>History</h2>
                <InterviewRoundEventsTable
                  events={interviewRoundEvents}
                  userId={company.user_id}
                  jobSeeker={application.jobSeeker}
                  company={company}
                />
              </div>
            ) : null}
          </div>
        ) : application.status === 'submitted' ? (
          'Pending until you accept the application.'
        ) : (
          `Application is ${application.status}`
        )}
      </Section>

      <Section title="Application History" isLast={true}>
        {applicationEvents?.length ? (
          <ApplicationEventsTable
            events={applicationEvents}
            jobSeeker={application.jobSeeker}
            company={company}
          />
        ) : (
          'No events'
        )}
      </Section>
    </>
  );
};

export default ApplicationDetails;
