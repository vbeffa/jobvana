import { useContext } from 'react';
import { CompanyContext, JobvanaContext } from '../Context';
import MyJobs from './company/MyJobs';
import Jobs from './job_seekers/Jobs';

export default function JobsRoute() {
  const { userType } = useContext(JobvanaContext);
  const { company } = useContext(CompanyContext);

  return userType === 'company' ? (
    company && <MyJobs company={company} />
  ) : (
    <Jobs />
  );
}
