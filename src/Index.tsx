import { Link } from '@tanstack/react-router';
import { useContext, useMemo } from 'react';
import { getSession, getUserType } from './auth/utils';
import CompanyOnboarding from './companies/company/Onboarding';
import { CompanyContext, JobSeekerContext, JobvanaContext } from './Context';
import CompanyDashboard from './home/companies/Dashboard';
import JobSeekerDashboard from './home/job_seekers/Dashboard';
import JobSeekerOnboarding from './job_seekers/Onboarding';

const Index = () => {
  const { resetPassword, loggingOut } = useContext(JobvanaContext);
  const { company } = useContext(CompanyContext);
  const { jobSeeker } = useContext(JobSeekerContext);
  const session = getSession();
  const userType = getUserType();

  const isCompanyOnboarding = useMemo(
    () => userType === 'company' && company === null,
    [company, userType]
  );

  const isJobSeekerOnboarding = useMemo(
    () => userType === 'job_seeker' && jobSeeker === null,
    [jobSeeker, userType]
  );

  const greeting = useMemo(() => {
    const name =
      userType === 'job_seeker'
        ? jobSeeker?.first_name
        : session?.user.user_metadata.first_name;
    return name ? `Welcome to Jobvana, ${name}!` : '';
  }, [jobSeeker?.first_name, session?.user.user_metadata.first_name, userType]);

  return (
    <div className="flex flex-col">
      {loggingOut && (
        <div className="flex justify-center">
          <h3>Goodbye!</h3>
        </div>
      )}
      {session && !loggingOut && (
        <>
          {!isCompanyOnboarding && !isJobSeekerOnboarding && (
            <>
              {resetPassword && (
                <div className="flex flex-col gap-2">
                  <div className="flex justify-center">
                    <h3>{greeting}</h3>
                    <Link to="/jobvana/account">Reset your password</Link>
                  </div>
                </div>
              )}
              {!resetPassword && (
                <>
                  {jobSeeker && <JobSeekerDashboard jobSeeker={jobSeeker} />}
                  {company && <CompanyDashboard company={company} />}
                </>
              )}
            </>
          )}
          {isCompanyOnboarding && (
            <CompanyOnboarding userId={session.user.id} />
          )}
          {isJobSeekerOnboarding && (
            <JobSeekerOnboarding userId={session.user.id} />
          )}
        </>
      )}
    </div>
  );
};

export default Index;
