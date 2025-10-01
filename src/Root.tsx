import { Outlet } from '@tanstack/react-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import Login from './auth/Login';
import { getSession, getUserType, refreshSession } from './auth/utils';
import { findCompany } from './companies/utils';
import {
  CompanyContext,
  defaultJobSeekerContext,
  JobSeekerContext,
  JobvanaContext,
  type Company,
  type JobSeekerContextProps
} from './Context';
import supabase from './db/supabase';
import Header from './Header';

const Root = () => {
  const [currPage, setCurrPage] = useState('home');
  const [companiesContext, setCompaniesContext] = useState<
    JobSeekerContextProps['companiesContext']
  >(defaultJobSeekerContext.companiesContext);
  const [jobsContext, setJobsContext] = useState<
    JobSeekerContextProps['jobsContext']
  >(defaultJobSeekerContext.jobsContext);
  const [loggedIn, setLoggedIn] = useState<boolean>();
  const [loggingOut, setLoggingOut] = useState<boolean>();
  const [company, setCompany] = useState<Company | null>();

  const session = getSession();

  // TODO consolidate with function in auth/utils.ts
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

  if (userType === 'company') {
    return (
      <JobvanaContext.Provider
        value={{
          currPage,
          setCurrPage,
          loggedIn,
          loggingOut,
          logout
        }}
      >
        <CompanyContext.Provider
          value={{
            company,
            setCompany
          }}
        >
          <Header />
          {(isLoggedIn || currPage === 'about') && <Outlet />}
          {!isLoggedIn && currPage !== 'about' && <Login />}

          {/* <TanStackRouterDevtools /> */}
        </CompanyContext.Provider>
      </JobvanaContext.Provider>
    );
  }

  return (
    <JobvanaContext.Provider
      value={{
        currPage,
        setCurrPage,
        loggedIn,
        loggingOut,
        logout
      }}
    >
      <JobSeekerContext.Provider
        value={{
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
      </JobSeekerContext.Provider>
    </JobvanaContext.Provider>
  );
};

export default Root;
