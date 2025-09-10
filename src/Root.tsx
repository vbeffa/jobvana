import { Outlet } from '@tanstack/react-router';
import { useState } from 'react';
import { type JobvanaContextProps, JobvanaContext } from './Context';
import Header from './Header';

const Root = () => {
  const [companiesContext, setCompaniesContext] = useState<
    JobvanaContextProps['companiesContext']
  >({
    page: 1,
    minSize: 1,
    maxSize: 1000
  });
  const [jobsContext, setJobsContext] = useState<
    JobvanaContextProps['jobsContext']
  >({
    page: 1,
    company: '',
    title: '',
    minSalary: 10000,
    maxSalary: 200000
  });

  return (
    <JobvanaContext.Provider
      value={{
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
