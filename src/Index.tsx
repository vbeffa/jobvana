import { useContext } from 'react';
import { getSession, getUserType } from './auth/utils';
import Onboarding from './companies/company/Onboarding';
import { JobvanaContext } from './Context';

const Index = () => {
  const { loggingOut, company } = useContext(JobvanaContext);
  const session = getSession();
  const userType = getUserType();

  return (
    <div className="flex flex-col">
      {loggingOut && (
        <div className="flex justify-center">
          <h3>Goodbye!</h3>
        </div>
      )}
      {session && !loggingOut && (
        <div className="flex justify-center">
          <h3>Welcome to Jobvana, {session.user.user_metadata.first_name}!</h3>
        </div>
      )}
      {session && userType === 'company' && company === null && (
        <Onboarding userId={session.user.id} />
      )}
    </div>
  );
};

export default Index;
