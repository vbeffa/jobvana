import { useCallback, useMemo } from 'react';
import { FaPaperPlane } from 'react-icons/fa6';
import useApplicationsForJobSeeker from '../../applications/useApplicationsForJobSeeker';
import CompanyLink from '../../companies/CompanyLink';
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
  const { job, error, isPlaceholderData, isPending } = useJob(id);
  const { resumes } = useResumes(jobSeeker.user_id);
  const { applications } = useApplicationsForJobSeeker({
    jobSeekerId: jobSeeker.id
  });

  const onApply = useCallback(() => {
    if (!job) {
      return;
    }
    if (!resumes?.length) {
      alert('Please upload a resume to apply for this job.');
      return;
    }
    if (
      job.applications.filter((app) => app.status === 'accepted').length >=
      (job.company.interviewProcess?.pipeline_size ?? 1)
    ) {
      alert('Pipeline size limit reached.');
      return;
    }
    if (confirm('Your resume will be sent to this company. Proceed?')) {
      alert('Application sent!');
    }
  }, [job, resumes?.length]);

  const application = useMemo(
    () => applications?.find((app) => app.job_id === id),
    [applications, id]
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
          {!application && <Button label="Apply" onClick={onApply} />}
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
      <Section title="Skills" isLast={true}>
        <SkillsList skills={job.skills} />
      </Section>
      {/* <Section title="Applications" isLast={true}>
        {job.applications ? (
          <ApplicationsList applications={job.applications} />
        ) : null}
      </Section> */}
    </>
  );
};

export default JobDetails;
