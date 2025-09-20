import { useContext } from 'react';
import Login from './auth/Login';
import { getSession, getUserType } from './auth/utils';
import AddCompany from './companies/AddCompany';
import { JobvanaContext } from './Context';

const Index = () => {
  const { loggedIn, loggingOut, company } = useContext(JobvanaContext);
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
      {!loggedIn && <Login />}
      {session && userType === 'company' && (
        <>
          {company === null && <AddCompany userId={session.user.id} />}
          {/* {company && <EditCompany company={company} />} */}
        </>
      )}
    </div>
  );
};

export default Index;
