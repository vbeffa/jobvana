import { createFileRoute } from '@tanstack/react-router';
import { useContext } from 'react';
import Login from '../auth/Login';
import { getSession, getUserType } from '../auth/utils';
import CompanyDetails from '../companies/CompanyDetails';
import { JobvanaContext } from '../Context';

export const Route = createFileRoute('/jobvana/')({
  component: Index
});

function Index() {
  const { loggedIn, company } = useContext(JobvanaContext);
  const session = getSession();
  const userType = getUserType();

  return (
    <div className="flex flex-col ">
      {session && (
        <div className="flex justify-center">
          <h3>Welcome to Jobvana, {session.user.user_metadata.first_name}!</h3>
        </div>
      )}
      {!loggedIn && <Login />}
      {session && userType === 'company' && (
        <div className="w-full">
          {company === null && (
            <div className="mx-4">
              <h1>Onboarding</h1>
              <CompanyDetails userId={session.user.id} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
