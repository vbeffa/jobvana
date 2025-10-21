import { useContext } from 'react';
import { getUserType } from '../auth/utils';
import { CompanyContext, JobSeekerContext } from '../Context';
import { Route } from '../routes/jobvana.jobs.$id';
import CompanyJobDetails from './company/JobDetails';
import JobSeekerJobDetails from './job_seekers/JobDetails';

const JobRoute = () => {
  const { id } = Route.useLoaderData();
  const userType = getUserType();
  const { jobSeeker } = useContext(JobSeekerContext);
  const { company } = useContext(CompanyContext);

  return (
    <div className="flex justify-center mb-4">
      <div className="border-[0.5px] border-blue-400 rounded-lg w-[75%] overflow-hidden">
        {userType === 'job_seeker' && jobSeeker && (
          <div className="px-4 pt-2">
            <JobSeekerJobDetails
              id={id}
              jobSeeker={jobSeeker}
              showActionMenu={false}
            />
          </div>
        )}
        {userType === 'company' && company && (
          <CompanyJobDetails
            company={company}
            jobId={id}
            showActionMenu={false}
          />
        )}
      </div>
    </div>
  );
};

export default JobRoute;
