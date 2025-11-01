import { Outlet } from '@tanstack/react-router';
import { useCallback, useEffect, useState } from 'react';
import Login from './auth/Login';
import {
  checkIsLoggedIn,
  getSession,
  getUserType,
  refreshSession
} from './auth/utils';
import { findCompany } from './companies/utils';
import {
  CompanyContext,
  defaultCompanyContext,
  defaultContext,
  defaultJobSeekerContext,
  JobSeekerContext,
  JobvanaContext,
  type Company,
  type JobSeeker
} from './Context';
import supabase from './db/supabase';
import Header from './Header';
import { findJobSeeker } from './job_seekers/utils';
import type { CurrPage } from './types';

const Root = () => {
  const [currPage, setCurrPage] = useState<CurrPage>('home');
  const [accountNav, setAccountNav] = useState(defaultContext.accountNav);

  const [myCompanyNav, setMyCompanyNav] = useState(
    defaultCompanyContext.myCompanyNav
  );
  const [myJobsNav, setMyJobsNav] = useState(defaultCompanyContext.myJobsNav);
  const [jobApplicationsNav, setJobApplicationsNav] = useState(
    defaultCompanyContext.jobApplicationsNav
  );

  const [homeNav, setHomeNav] = useState(defaultJobSeekerContext.homeNav);
  const [jobSearchFilters, setJobSearchFilters] = useState(
    defaultJobSeekerContext.jobSearchFilters
  );
  const [jobNav, setJobNav] = useState(defaultJobSeekerContext.jobNav);
  const [companySearchFilters, setCompanySearchFilters] = useState(
    defaultJobSeekerContext.companySearchFilters
  );
  const [companyNav, setCompanyNav] = useState(
    defaultJobSeekerContext.companyNav
  );
  const [myApplicationsNav, setMyApplicationsNav] = useState(
    defaultJobSeekerContext.myApplicationsNav
  );

  const [loggedIn, setLoggedIn] = useState<boolean>();
  const [loggingOut, setLoggingOut] = useState<boolean>();
  const [resetPassword, setResetPassword] = useState(false);

  const [company, setCompany] = useState<Company | null>();
  const [jobSeeker, setJobSeeker] = useState<JobSeeker | null>();

  const session = getSession();

  const isLoggedIn = checkIsLoggedIn();

  if (loggedIn === undefined) {
    setLoggedIn(session !== null && isLoggedIn);
  }

  useEffect(() => {
    if (isLoggedIn) {
      refreshSession();
    }
  }, [isLoggedIn]);

  const userType = getUserType();

  useEffect(() => {
    if (userType === 'company') {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setAccountNav('account');
    }
  }, [userType]);

  useEffect(() => {
    (async () => {
      if (session && isLoggedIn) {
        if (userType === 'company' && !company) {
          const company = await findCompany(session.user.id);
          setCompany(company);
        } else if (userType === 'job_seeker' && !jobSeeker) {
          const jobSeeker = await findJobSeeker(session.user.id);
          setJobSeeker(jobSeeker);
        }
      }
    })();
  }, [company, isLoggedIn, jobSeeker, session, userType]);

  useEffect(() => {
    supabase.auth.onAuthStateChange(async (event) => {
      if (event == 'PASSWORD_RECOVERY') {
        setResetPassword(true);
      } else if (event === 'SIGNED_IN') {
        setLoggedIn(true);
      }
    });
  }, []);

  const logout = useCallback(async () => {
    setLoggingOut(true);
    await supabase.auth.signOut({ scope: 'local' });
    setCompany(undefined);
    setJobSeeker(undefined);
    setLoggedIn(false);
    setLoggingOut(false);
  }, []);

  // window.addEventListener('login', () => {
  //   setLoggedIn(true);
  // });

  if (userType === 'company') {
    return (
      <JobvanaContext.Provider
        value={{
          currPage,
          setCurrPage,
          accountNav,
          setAccountNav,
          loggedIn,
          loggingOut,
          logout,
          resetPassword,
          setResetPassword
        }}
      >
        <CompanyContext.Provider
          value={{
            company,
            setCompany,
            myCompanyNav,
            setMyCompanyNav,
            myJobsNav,
            setMyJobsNav,
            jobApplicationsNav,
            setJobApplicationsNav
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
        accountNav,
        setAccountNav,
        loggedIn,
        loggingOut,
        logout,
        resetPassword,
        setResetPassword
      }}
    >
      <JobSeekerContext.Provider
        value={{
          jobSeeker,
          setJobSeeker,
          homeNav,
          setHomeNav,
          jobSearchFilters,
          setJobSearchFilters,
          jobNav,
          setJobNav,
          companySearchFilters,
          setCompanySearchFilters,
          companyNav,
          setCompanyNav,
          myApplicationsNav,
          setMyApplicationsNav
        }}
      >
        <Header />
        {(isLoggedIn || currPage === 'about') && <Outlet />}
        {!isLoggedIn && !resetPassword && currPage !== 'about' && <Login />}

        {/* <TanStackRouterDevtools /> */}
      </JobSeekerContext.Provider>
    </JobvanaContext.Provider>
  );
};

export default Root;
