import { createFileRoute } from '@tanstack/react-router';
import { useContext } from 'react';
import Applications from '../applications/job_seeker/Applications';
import { getUserType } from '../auth/utils';
import { CompanyContext, JobSeekerContext } from '../Context';

export const Route = createFileRoute('/jobvana/applications/')({
  component: Switcher
});

function Switcher() {
  const userType = getUserType();
  const { company } = useContext(CompanyContext);
  const { jobSeeker } = useContext(JobSeekerContext);

  return userType === 'company'
    ? company && <>TODO</>
    : jobSeeker && <Applications jobSeekerId={jobSeeker.id} />;
}
