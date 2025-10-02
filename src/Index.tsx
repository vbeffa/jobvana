import { Link } from '@tanstack/react-router';
import { useContext, useMemo } from 'react';
import { getSession, getUserType } from './auth/utils';
import CompanyOnboarding from './companies/company/Onboarding';
import { CompanyContext, JobSeekerContext, JobvanaContext } from './Context';
import JobSeekerOnboarding from './job_seekers/Onboarding';

const Index = () => {
  const { resetPassword, loggingOut } = useContext(JobvanaContext);
  const { company } = useContext(CompanyContext);
  const { jobSeeker } = useContext(JobSeekerContext);
  const session = getSession();
  const userType = getUserType();

  const isCompanyOnboarding = useMemo(
    () => userType === 'company' && company === undefined,
    [company, userType]
  );

  const isJobSeekerOnboarding = useMemo(
    () => userType === 'job_seeker' && jobSeeker === undefined,
    [jobSeeker, userType]
  );

  const greeting = useMemo(() => {
    const name =
      userType === 'job_seeker'
        ? jobSeeker?.first_name
        : session?.user.user_metadata.first_name;
    return `Welcome to Jobvana, ${name}!`;
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
            <div className="flex flex-col gap-2">
              <div className="flex justify-center">
                <h3>{greeting}</h3>
              </div>
              <div className="flex justify-center">
                {resetPassword && (
                  <Link to="/jobvana/account">Reset your password</Link>
                )}
              </div>
            </div>
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
