import { createFileRoute } from '@tanstack/react-router';
import { useContext } from 'react';
import CompanyApplications from '../applications/company/Applications';
import JobSeekerApplications from '../applications/job_seeker/Applications';
import { CompanyContext, JobSeekerContext, JobvanaContext } from '../Context';

export const Route = createFileRoute('/jobvana/applications/')({
  component: Switcher
});

function Switcher() {
  const { userType } = useContext(JobvanaContext);
  const { company } = useContext(CompanyContext);
  const { jobSeeker } = useContext(JobSeekerContext);

  return userType === 'company'
    ? company && <CompanyApplications companyId={company.id} />
    : jobSeeker && <JobSeekerApplications jobSeekerId={jobSeeker.id} />;
}
