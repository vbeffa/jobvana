import { useCallback, useContext, useMemo, useState } from 'react';
import { FaX } from 'react-icons/fa6';
import CompanyLink from '../../companies/CompanyLink';
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
import useApplicationEvents from '../useApplicationEvents';
import useInterview from '../useInterview';
import useInterviewRoundEvents from '../useInterviewRoundEvents';
import { updateStatus } from '../utils';
import JobApplications from './JobApplications';
import useApplication from './useApplication';

const ApplicationDetails = ({ id }: { id: number }) => {
  const { jobSeeker } = useContext(JobSeekerContext);
  const {
    application,
    isPending: isApplicationPending,
    isPlaceholderData: isApplicationPlaceholderData,
    error: applicationError,
    refetch: refetchApplication
  } = useApplication({ id });
  const {
    events: applicationEvents,
    isPending: isApplicationEventsPending,
    isPlaceholderData: isApplicationEventsPlaceholderData,
    error: applicationEventsError,
    refetch: refetchApplicationEvents
  } = useApplicationEvents({
    applicationId: id
  });
  const {
    interview,
    isPending: isInterviewPending,
    isPlaceholderData: isInterviewPlaceholderData,
    error: interviewError,
    refetch: refetchInterview
  } = useInterview({
    applicationId: id
  });
  const {
    events: interviewRoundEvents,
    isPending: isInterviewRoundEventsPending,
    isPlaceholderData: isInterviewRoundEventsPlaceholderData,
    refetch: refetchInterviewRoundEvents
  } = useInterviewRoundEvents({
    interviewId: interview?.id
  });

  const [isUpdating, setIsUpdating] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [resumeError, setResumeError] = useState<Error>();

  const isPending = useMemo(
    () =>
      isApplicationPending ||
      isApplicationEventsPending ||
      isInterviewPending ||
      isInterviewRoundEventsPending,
    [
      isApplicationEventsPending,
      isApplicationPending,
      isInterviewPending,
      isInterviewRoundEventsPending
    ]
  );

  const isPlaceholderData = useMemo(
    () =>
      isApplicationPlaceholderData ||
      isApplicationEventsPlaceholderData ||
      isInterviewPlaceholderData ||
      isInterviewRoundEventsPlaceholderData,
    [
      isApplicationEventsPlaceholderData,
      isApplicationPlaceholderData,
      isInterviewPlaceholderData,
      isInterviewRoundEventsPlaceholderData
    ]
  );

  const error = useMemo(
    () =>
      applicationError ??
      applicationEventsError ??
      interviewError ??
      resumeError,
    [applicationError, applicationEventsError, interviewError, resumeError]
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
        // setDoRefetch(applicationId);
        refetch(); // don't await refetch so the alert displays immediately
        alert('Application withdrawn.');
      } finally {
        setIsUpdating(false);
        // setDoRefetch(0);
      }
    },
    [jobSeeker?.user_id, refetch]
  );

  if (!application || !jobSeeker) {
    return null;
  }

  return (
    <>
      {isDownloading ? <Modal type="downloading" /> : null}
      {isPending ? <Modal type="loading" /> : null}
      {isPlaceholderData ? <Modal type="loading" /> : null}
      {isUpdating ? <Modal type="updating" /> : null}
      {error ? <JobvanaError error={error} /> : null}
      {/* <h1>Application Details</h1> */}
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
              <div className="w-22">Company:</div>
              <CompanyLink {...application.company} />
            </div>
            <div className="flex flex-row">
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
            <div className="flex flex-row items-center">
              <div className="w-26">Actions:</div>
              {application.status !== 'withdrawn' && (
                <FaX
                  className="text-blue-400 cursor-pointer"
                  onClick={() => onWithdraw(application.id)}
                />
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
              userType="job_seeker"
              userId={jobSeeker.user_id}
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
                  userId={jobSeeker.user_id}
                  jobSeeker={application.jobSeeker}
                  company={application.company}
                />
              </div>
            ) : null}
          </div>
        ) : application.status === 'submitted' ? (
          'Pending until the company accepts the application.'
        ) : (
          `Application is ${application.status}`
        )}
      </Section>

      <Section title="Application History" isLast={true}>
        {applicationEvents?.length ? (
          <ApplicationEventsTable
            events={applicationEvents}
            jobSeeker={application.jobSeeker}
            company={application.company}
          />
        ) : (
          'No events'
        )}
      </Section>
    </>
  );
};

export default ApplicationDetails;
