import { createFileRoute } from '@tanstack/react-router';
import { useContext } from 'react';
import Login from '../auth/Login';
import { getSession, getUserType, isLoggedIn } from '../auth/utils';
import CompanyDetails from '../companies/CompanyDetails';
import { JobvanaContext } from '../Context';
import LoadingModal from '../LoadingModal';

export const Route = createFileRoute('/jobvana/')({
  component: Index
});

function Index() {
  const { loggedIn, company } = useContext(JobvanaContext);
  const session = getSession();
  const userType = getUserType();
  console.log(company);

  return (
    <div className="flex flex-col ">
      {/* <div className="flex flex-col border"> */}
      {isLoggedIn() && (
        <div className="flex justify-center">
          <h3>Welcome to Jobvana, {session?.user.user_metadata.first_name}!</h3>
        </div>
      )}
      {!loggedIn && <Login />}
      {session && userType === 'company' && (
        <div className="w-full">
          {company === undefined && <LoadingModal />}
          {/* {company === null && <AddCompany userId={session?.user.id} />} */}
          {company === null && (
            <div className="mx-4">
              <CompanyDetails userId={session.user.id} />
            </div>
          )}
        </div>
      )}
      {/* </div> */}
    </div>
  );
}
