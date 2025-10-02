import { Link } from '@tanstack/react-router';
import { useContext, useMemo } from 'react';
import { getSession, getUserType } from './auth/utils';
import Onboarding from './companies/company/Onboarding';
import { CompanyContext, JobvanaContext } from './Context';

const Index = () => {
  const { resetPassword } = useContext(JobvanaContext);
  const { loggingOut } = useContext(JobvanaContext);
  const { company } = useContext(CompanyContext);
  const session = getSession();
  const userType = getUserType();

  const isOnboarding = useMemo(
    () => userType === 'company' && company === null,
    [company, userType]
  );

  return (
    <div className="flex flex-col">
      {loggingOut && (
        <div className="flex justify-center">
          <h3>Goodbye!</h3>
        </div>
      )}
      {session && !loggingOut && (
        <>
          {!isOnboarding && (
            <div className="flex flex-col gap-2">
              <div className="flex justify-center">
                <h3>
                  Welcome to Jobvana, {session.user.user_metadata.first_name}!
                </h3>
              </div>
              <div className="flex justify-center">
                {resetPassword && (
                  <Link to="/jobvana/account">Reset your password</Link>
                )}
              </div>
            </div>
          )}
          {isOnboarding && <Onboarding userId={session.user.id} />}
        </>
      )}
    </div>
  );
};

export default Index;
