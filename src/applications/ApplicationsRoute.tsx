import { useContext } from 'react';
import { CompanyContext, JobSeekerContext, JobvanaContext } from '../Context';
import CompanyApplications from './company/Applications';
import JobSeekerApplications from './job_seeker/Applications';

export default function ApplicationsRoute() {
  const { userType } = useContext(JobvanaContext);
  const { company } = useContext(CompanyContext);
  const { jobSeeker } = useContext(JobSeekerContext);

  return userType === 'company'
    ? company && <CompanyApplications companyId={company.id} />
    : jobSeeker && <JobSeekerApplications jobSeekerId={jobSeeker.id} />;
}
