import { useCallback, useMemo, useState } from 'react';
import { FaPaperPlane } from 'react-icons/fa6';
import ApplicationsList from '../../applications/job_seeker/ApplicationsList';
import useApplications from '../../applications/job_seeker/useApplications';
import CompanyLink from '../../companies/CompanyLink';
import InterviewProcessDisplay from '../../companies/InterviewProcessDisplay';
import type { JobSeeker } from '../../Context';
import Button from '../../controls/Button';
import useResumes from '../../job_seekers/useResumes';
import JobvanaError from '../../JobvanaError';
import Modal from '../../Modal';
import Section from '../../Section';
import SkillsList from '../../skills/SkillsList';
import JobRoles from '../JobRoles';
import Salary from './Salary';
import useJob from './useJob';

const JobDetails = ({
  id,
  jobSeeker
}: {
  id: number;
  jobSeeker: JobSeeker;
}) => {
  const {
    job,
    error,
    isPlaceholderData,
    isPending,
    refetch: refetchJob
  } = useJob(id);
  const { resumes } = useResumes(jobSeeker.user_id);
  const {
    applications,
    apply,
    refetch: refetchApplications
  } = useApplications({
    jobSeekerId: jobSeeker.id
  });
  const [isApplying, setIsApplying] = useState(false);
  const [applyError, setApplyError] = useState<Error>();

  const onApply = useCallback(async () => {
    if (!job) {
      alert('Job is undefined.');
      return;
    }
    if (!resumes?.length) {
      alert('Please upload a resume to apply for this job.');
      return;
    }
    const activeResume = resumes.find(
      (resume) => resume.id === jobSeeker.active_resume_id
    );
    if (/* should never happen */ !activeResume) {
      alert('Please make a resume active to apply for this job.');
      return;
    }
    if (
      confirm(
        'Your resume will be sent to this company. If your application is accepted, you must commit to at least the first interview round. You may still withdraw your application if the company has not accepted your application, but you will not be able to reapply to this job. Proceed?'
      )
    ) {
      setIsApplying(true);
      setApplyError(undefined);
      try {
        await apply(id, jobSeeker, activeResume.name);
        Promise.all([refetchJob(), refetchApplications()]); // don't await refetches so the alert displays immediately
        alert('Application sent!');
      } catch (err) {
        console.log(err);
        setApplyError(err as Error);
      } finally {
        setIsApplying(false);
      }
    }
  }, [apply, id, job, jobSeeker, refetchApplications, refetchJob, resumes]);

  const application = useMemo(
    () => applications?.find((app) => app.job_id === id),
    [applications, id]
  );

  // TODO remove once interviewProcess is not nullable
  const noInterviewProcess = useMemo(
    () => job && !job.company.interviewProcess,
    [job]
  );
  const pipelineLimitReached = useMemo(
    () =>
      job &&
      job.company.interviewProcess &&
      job.activeApplicationCount >= job.company.interviewProcess.pipeline_size,
    [job]
  );

  if (error) {
    return <JobvanaError error={error} />;
  }

  if (isPending) {
    return <Modal type="loading" />;
  }

  if (!job) {
    return null;
  }

  return (
    <>
      {isPlaceholderData && <Modal type="loading" />}
      {isApplying && <Modal type="applying" />}
      {applyError && <JobvanaError error={applyError} />}
      <Section
        title={
          <div className="flex justify-between">
            <div>{job.title}</div>
            <div>{new Date(job.created_at).toLocaleDateString()}</div>
          </div>
        }
      >
        <div className="flex flex-row gap-x-2">
          <CompanyLink {...job.company} />
          <Salary {...job} />
        </div>
        <div className="text-sm">
          {job.address ? `${job.address.city}, ${job.address.state}` : 'Remote'}
        </div>
        <div className="absolute right-0 top-7">
          {!application && (
            <div className="flex flex-row gap-2">
              <div className="text-sm text-gray-400 content-center">
                {noInterviewProcess && <>No interview process</>}
                {pipelineLimitReached && (
                  <>Company pipeline size limit reached</>
                )}
              </div>
              <Button
                label="Apply"
                disabled={
                  noInterviewProcess || pipelineLimitReached || isApplying
                }
                onClick={onApply}
              />
            </div>
          )}
          {application && (
            <div className="flex flex-row gap-1 text-sm">
              <div className="content-center">
                <FaPaperPlane />
              </div>
              {new Date(application.created_at).toLocaleDateString()}
            </div>
          )}
        </div>
      </Section>
      <Section title="Description">{job.description}</Section>
      <Section title="Roles">
        <JobRoles {...job} />
      </Section>
      <Section title="Skills">
        <SkillsList skills={job.skills} />
      </Section>
      <Section title="Interview Process">
        {job.interviewProcess ? (
          <div className="border-[0.5px] border-blue-300 rounded-lg mt-2 px-4 py-4">
            <InterviewProcessDisplay
              interviewProcess={job.interviewProcess}
              activeApplicationCount={job.activeApplicationCount}
            />
          </div>
        ) : null}
      </Section>
      <Section title="All Applications" isLast={true}>
        <ApplicationsList statuses={job.applicationStatuses} />
      </Section>
    </>
  );
};

export default JobDetails;
