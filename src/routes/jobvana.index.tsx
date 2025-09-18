import { createFileRoute } from '@tanstack/react-router';
import { useContext } from 'react';
import Login from '../auth/Login';
import { getSession, getUserType } from '../auth/utils';
import CompanyDetails from '../companies/CompanyDetails';
import { JobvanaContext } from '../Context';
import LoadingModal from '../LoadingModal';

export const Route = createFileRoute('/jobvana/')({
  component: Index
  // loader: async (loaderContext) => {
  //   const context = loaderContext.context;
  //   const userType = getUserType();
  //   const session = getSession();
  //   console.log(session);
  //   console.log(isLoggedIn());
  //   console.log(userType);
  //   console.log(context);
  //   if (session && isLoggedIn() && userType === 'company' && !context.company) {
  //     const company = await findCompany(session.user.id);
  //     if (company) {
  //       console.log('redirect');
  //       console.log('setting context');
  //       context.setCompany(company);
  //       redirect({
  //         to: '/jobvana/companies/$id',
  //         params: { id: company.id.toString() },
  //         throw: true
  //       });
  //     }
  //   }
  // }
});

function Index() {
  const { loggedIn, company } = useContext(JobvanaContext);
  const session = getSession();
  const userType = getUserType();
  console.log(company);

  return (
    <div className="flex flex-col ">
      {/* <div className="flex flex-col border"> */}
      {company && (
        <div className="flex justify-center">
          <h3>Welcome to Jobvana!</h3>
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
