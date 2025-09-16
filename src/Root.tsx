import type { Session } from '@supabase/supabase-js';
import { Outlet } from '@tanstack/react-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  type JobvanaContextProps,
  defaultContext,
  JobvanaContext
} from './Context';
import Header from './Header';
import supabase from './utils/supabase';

const PROJECT_ID = 'mpwtyvmjfazgumpeawvb';

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
  const [loggedIn, setLoggedIn] = useState<boolean>();
  console.log(loggedIn);

  const session = useMemo(() => {
    const authToken = window.localStorage.getItem(
      `sb-${PROJECT_ID}-auth-token`
    );
    return authToken ? (JSON.parse(authToken) as Session) : null;
  }, []);

  const isLoggedIn = useCallback(() => {
    return (
      session !== null &&
      session.expires_at !== undefined &&
      session.expires_at * 1000 > Date.now()
    );
  }, [session]);

  useEffect(() => {
    (async () => {
      if (session !== null && isLoggedIn()) {
        await supabase.auth.refreshSession({
          refresh_token: session.refresh_token
        });
        setLoggedIn(true);
      } else {
        setLoggedIn(false);
      }
    })();
  }, [isLoggedIn, session]);

  const logout = useCallback(() => {
    supabase.auth.signOut({ scope: 'local' });
    setLoggedIn(false);
  }, []);

  window.addEventListener('login', () => {
    setLoggedIn(true);
  });

  return (
    <JobvanaContext.Provider
      value={{
        authContext,
        setAuthContext,
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
