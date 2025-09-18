import { Outlet } from '@tanstack/react-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { getSession, getUserType, refreshSession } from './auth/utils';
import { findCompany } from './companies/utils';
import {
  type JobvanaContextProps,
  defaultContext,
  JobvanaContext
} from './Context';
import Header from './Header';
import type { Company } from './types';
import supabase from './utils/supabase';

export const PROJECT_ID = 'mpwtyvmjfazgumpeawvb';

const Root = () => {
  const [companiesContext, setCompaniesContext] = useState<
    JobvanaContextProps['companiesContext']
  >(defaultContext.companiesContext);
  const [jobsContext, setJobsContext] = useState<
    JobvanaContextProps['jobsContext']
  >(defaultContext.jobsContext);
  const [loggedIn, setLoggedIn] = useState<boolean>();
  const [company, setCompany] = useState<Company>();

  const session = getSession();

  const isLoggedIn = useMemo(() => {
    return (
      session !== null &&
      session.expires_at !== undefined &&
      session.expires_at * 1000 > Date.now()
    );
  }, [session]);
  console.log(isLoggedIn);
  console.log(company);

  useEffect(() => {
    setLoggedIn(session !== null && isLoggedIn);
  }, [isLoggedIn, session]);

  useEffect(() => {
    if (isLoggedIn) {
      refreshSession();
    }
  }, [isLoggedIn]);

  const userType = getUserType();
  useEffect(() => {
    (async () => {
      if (session && isLoggedIn && userType === 'company' && !company) {
        const company = await findCompany(session.user.id);
        setCompany(company);
      }
    })();
  }, [company, isLoggedIn, session, userType]);

  const logout = useCallback(async () => {
    await supabase.auth.signOut({ scope: 'local' });
    setCompany(undefined);
    setLoggedIn(false);
  }, []);

  window.addEventListener('login', () => {
    setLoggedIn(true);
  });

  return (
    <JobvanaContext.Provider
      value={{
        company,
        setCompany,
        loggedIn,
        logout,
        companiesContext,
        setCompaniesContext,
        jobsContext,
        setJobsContext
      }}
    >
      <Header />
      {userType === 'company' && (
        <div className="flex flex-row w-screen">
          <div className="bg-amber-300 w-64 pl-4 pt-4 h-screen top-16 left-0 fixed z-10 flex gap-[5%]">
            <div className="flex flex-col gap-2">
              <div>My Account</div>
              <div>Company</div>
              <div>Offices</div>
              <div>Jobs</div>
              <div>Applications</div>
            </div>
          </div>
          <div className="ml-64 w-full">
            <Outlet />
          </div>
        </div>
      )}
      {userType !== 'company' && <Outlet />}

      {/* <TanStackRouterDevtools /> */}
    </JobvanaContext.Provider>
  );
};

export default Root;
