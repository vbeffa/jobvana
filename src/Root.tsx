import { Outlet } from '@tanstack/react-router';
import { useState } from 'react';
import { MAX_COMPANY_SIZE, MIN_COMPANY_SIZE } from './companies/useCompanies';
import { type JobvanaContextProps, JobvanaContext } from './Context';
import Header from './Header';
import { MAX_SALARY, MIN_SALARY } from './jobs/useJobs';

const Root = () => {
  const [companiesContext, setCompaniesContext] = useState<
    JobvanaContextProps['companiesContext']
  >({
    page: 1,
    minSize: MIN_COMPANY_SIZE,
    maxSize: MAX_COMPANY_SIZE
  });
  const [jobsContext, setJobsContext] = useState<
    JobvanaContextProps['jobsContext']
  >({
    page: 1,
    company: '',
    title: '',
    minSalary: MIN_SALARY,
    maxSalary: MAX_SALARY
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
