import { Outlet } from '@tanstack/react-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import Login from './auth/Login';
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
  const [currPage, setCurrPage] = useState('home');
  const [companiesContext, setCompaniesContext] = useState<
    JobvanaContextProps['companiesContext']
  >(defaultContext.companiesContext);
  const [jobsContext, setJobsContext] = useState<
    JobvanaContextProps['jobsContext']
  >(defaultContext.jobsContext);
  const [loggedIn, setLoggedIn] = useState<boolean>();
  const [loggingOut, setLoggingOut] = useState<boolean>();
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
    setLoggingOut(true);
    await supabase.auth.signOut({ scope: 'local' });
    setCompany(undefined);
    setLoggedIn(false);
    setLoggingOut(false);
  }, []);

  window.addEventListener('login', () => {
    setLoggedIn(true);
  });

  return (
    <JobvanaContext.Provider
      value={{
        currPage,
        setCurrPage,
        company,
        setCompany,
        loggedIn,
        loggingOut,
        logout,
        companiesContext,
        setCompaniesContext,
        jobsContext,
        setJobsContext
      }}
    >
      <Header />
      {(isLoggedIn || currPage === 'about') && <Outlet />}
      {!isLoggedIn && currPage !== 'about' && <Login />}

      {/* <TanStackRouterDevtools /> */}
    </JobvanaContext.Provider>
  );
};

export default Root;
