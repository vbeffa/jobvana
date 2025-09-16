import { Outlet } from '@tanstack/react-router';
import { useState } from 'react';
import {
  type JobvanaContextProps,
  defaultContext,
  JobvanaContext
} from './Context';
import Header from './Header';

const Root = () => {
  const [authContext, setAuthContext] = useState<
    JobvanaContextProps['authContext']
  >(defaultContext.authContext);
  const [companiesContext, setCompaniesContext] = useState<
    JobvanaContextProps['companiesContext']
  >(defaultContext.companiesContext);
  const [jobsContext, setJobsContext] = useState<
    JobvanaContextProps['jobsContext']
  >(defaultContext.jobsContext);

  return (
    <JobvanaContext.Provider
      value={{
        authContext,
        setAuthContext,
        isLoggedIn: defaultContext.isLoggedIn,
        companiesContext,
        setCompaniesContext,
        jobsContext,
        setJobsContext
      }}
    >
      <Header />
      <Outlet />
      {/* <TanStackRouterDevtools /> */}
    </JobvanaContext.Provider>
  );
};

export default Root;
