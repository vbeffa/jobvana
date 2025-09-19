import { Outlet } from '@tanstack/react-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { getSession, getUserType, refreshSession } from './auth/utils';
import { findCompany } from './companies/utils';
import {
  type Company,
  type JobvanaContextProps,
  defaultContext,
  JobvanaContext
} from './Context';
import Header from './Header';
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
  const [company, setCompany] = useState<Company | null>();

  const session = getSession();

  const isLoggedIn = useMemo(() => {
    return (
      session !== null &&
      session.expires_at !== undefined &&
      session.expires_at * 1000 > Date.now()
    );
  }, [session]);

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
      <Outlet />

      {/* <TanStackRouterDevtools /> */}
    </JobvanaContext.Provider>
  );
};

export default Root;
