import { Link } from '@tanstack/react-router';
import { useCallback, useMemo, useState } from 'react';
import { FaSave } from 'react-icons/fa';
import { FaPaperPlane, FaRocket, FaTrashCan } from 'react-icons/fa6';
import ApplicationsList from '../../applications/job_seeker/ApplicationsList';
import useApplicationForJob from '../../applications/job_seeker/useApplicationForJob';
import CompanyLink from '../../companies/CompanyLink';
import InterviewProcessDisplay from '../../companies/InterviewProcessDisplay';
import ActionMenuContainer from '../../containers/ActionMenuContainer';
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
import { apply } from './utils';

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
  const { application, refetch: refetchApplication } = useApplicationForJob({
    jobSeekerId: jobSeeker.id,
    jobId: id
  });
  const [isApplying, setIsApplying] = useState(false);
  const [applyError, setApplyError] = useState<Error>();

  const onApply = useCallback(async () => {
    if (!job) {
      alert('Job is undefined.');
      return;
    }

    const activeResume = resumes?.find(
      (resume) => resume.id === jobSeeker.active_resume_id
    );
    if (/* should never happen */ !activeResume) {
      alert('No active resume found!');
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
        Promise.all([refetchJob(), refetchApplication()]); // don't await refetches so the alert displays immediately
        alert('Application sent!');
      } catch (err) {
        console.log(err);
        setApplyError(err as Error);
      } finally {
        setIsApplying(false);
      }
    }
  }, [id, job, jobSeeker, refetchApplication, refetchJob, resumes]);

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

  const applyDisabled = useMemo(
    () =>
      noInterviewProcess ||
      pipelineLimitReached ||
      !resumes?.length ||
      isApplying,
    [isApplying, noInterviewProcess, pipelineLimitReached, resumes?.length]
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

  if (!job) {
    return null;
  }

  return (
    <>
      <div className="relative top-10">
        {isPlaceholderData && <Modal type="loading" />}
        {isApplying && <Modal type="applying" />}
        {applyError && <JobvanaError error={applyError} />}
      </div>
      <ActionMenuContainer>
        <div className="flex flex-row gap-2 items-center text-sm">
          Posted:
          <div className="flex flex-row gap-1 items-center">
            <FaRocket />
            {new Date(job.created_at).toLocaleDateString()}
          </div>
          {job.interviewProcess && (
            <>
              <div className="h-fit py-2 border-r-[1px]" />
              Pipeline: {job.activeApplicationCount} /{' '}
              {job.interviewProcess.pipeline_size}
            </>
          )}
        </div>
        {application === null ? (
          <div className="flex flex-row gap-2 items-center">
            <div className="text-sm text-gray-400 content-center">
              {noInterviewProcess && <>Company has no interview process</>}
              {pipelineLimitReached && <>Company pipeline size limit reached</>}
              {resumes?.length === 0 && (
                <>Please upload a resume to apply for this job</>
              )}
            </div>
            {!applyDisabled && (
              <div className="flex flex-row gap-2 text-sm items-center">
                <FaSave
                  className="cursor-pointer hover:text-blue-400"
                  onClick={() => alert('TODO: Save Job')}
                />
                <FaTrashCan
                  className="cursor-pointer hover:text-blue-400"
                  onClick={() => alert('TODO: Hide Job')}
                />
                {/* <FaPaperPlane
                  className="cursor-pointer hover:text-blue-400"
                  onClick={onApply}
                /> */}
              </div>
            )}
          </div>
        ) : undefined}
        {application ? (
          <div className="flex items-center">
            <Link
              to="/jobvana/applications/$id"
              params={{ id: application.id.toString() }}
            >
              <div className="flex flex-row gap-1 text-sm">
                <div className="content-center">
                  <FaPaperPlane />
                </div>
                {new Date(application.created_at).toLocaleDateString()}
              </div>
            </Link>
          </div>
        ) : undefined}
      </ActionMenuContainer>
      <div className="px-4 mt-2">
        <Section
          title={
            <div className="flex justify-between">
              <div>{job.title}</div>
              {/* <div>{new Date(job.created_at).toLocaleDateString()}</div> */}
              <div>ID: {job.id}</div>
            </div>
          }
        >
          <div className="flex flex-row gap-x-2">
            <CompanyLink {...job.company} />
            <Salary {...job} />
          </div>
          <div className="text-sm">
            {job.address
              ? `${job.address.city}, ${job.address.state}`
              : 'Remote'}
          </div>
          <div className="absolute right-0 top-10">
            {application === null && (
              <div className="flex flex-row gap-2">
                <div className="text-sm text-gray-400 content-center">
                  {noInterviewProcess && <>No interview process</>}
                  {pipelineLimitReached && (
                    <>Company pipeline size limit reached</>
                  )}
                  {resumes?.length === 0 && (
                    <>Please upload a resume to apply for this job</>
                  )}
                </div>
                <Button
                  label="Apply"
                  disabled={
                    noInterviewProcess ||
                    pipelineLimitReached ||
                    !resumes?.length ||
                    isApplying
                  }
                  onClick={onApply}
                />
              </div>
            )}
            {/* {application && (
              <Link
                to="/jobvana/applications/$id"
                params={{ id: application.id.toString() }}
              >
                <div className="flex flex-row gap-1 text-sm">
                  <div className="content-center">
                    <FaPaperPlane />
                  </div>
                  {new Date(application.created_at).toLocaleDateString()}
                </div>
              </Link>
            )} */}
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
      </div>
    </>
  );
};

export default JobDetails;
