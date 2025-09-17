import { Outlet } from '@tanstack/react-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { getSession, refreshSession } from './auth/utils';
import {
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

  const logout = useCallback(async () => {
    await supabase.auth.signOut({ scope: 'local' });
    setLoggedIn(false);
  }, []);

  window.addEventListener('login', () => {
    setLoggedIn(true);
  });

  return (
    <JobvanaContext.Provider
      value={{
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
