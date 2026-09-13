import type { AuthError, Session } from '@supabase/supabase-js';
import {
  MAX_EMAIL_LENGTH,
  MIN_EMAIL_LENGTH
} from '../companies/job_seeker/useCompanies';
import type { UserType } from '../Context';
import supabase from '../db/supabase';
import { MAX_PASSWORD_LENGTH, MIN_PASSWORD_LENGTH } from './Login';

const checkIsLoggedIn = () => {
  const session = getSession();
  return (
    session !== null &&
    session.expires_at !== undefined &&
    session.expires_at * 1000 > Date.now()
  );
};

const getSession = () => {
  const authToken = window.localStorage.getItem(
    `sb-${import.meta.env.VITE_SUPABASE_PROJECT_ID}-auth-token`
  );
  return authToken ? (JSON.parse(authToken) as Session) : null;
};

const isStale = (seconds: number) => {
  const session = getSession();
  return (
    session !== null &&
    session.expires_at !== undefined &&
    Date.now() - (session.expires_at - session.expires_in) * 1000 >
      seconds * 1000
  );
};

const getUserType = async (userId: string): Promise<UserType> => {
  const { data, error } = await supabase
    .from('user_registrations')
    .select('user_type')
    .eq('user_id', userId)
    .single();

  if (error) {
    throw error;
  }

  return data.user_type;
};

// refresh session every five minutes, checking if stale every five seconds
const refreshSession = async () => {
  // console.log('refreshing session');
  window.setTimeout(() => refreshSession(), 1000 * 5);

  const session = getSession();
  if (session === null) {
    return;
  }

  if (!isStale(300)) {
    // console.log('not stale');
    return;
  }

  const refreshToken = session.refresh_token;
  const authResponse = await supabase.auth.refreshSession({
    refresh_token: refreshToken
  });
  if (authResponse.error) {
    console.error(
      'Could not refresh session',
      authErrorDetails(authResponse.error)
    );
  }
};

const authErrorDetails = (error: AuthError) => ({
  name: error.name,
  code: error.code,
  status: error.status,
  message: error.message
});

const isPasswordValid = (password: string) =>
  password.length >= MIN_PASSWORD_LENGTH &&
  password.length <= MAX_PASSWORD_LENGTH;

// TODO add email address validation
const isEmailValid = (email: string) =>
  email.length >= MIN_EMAIL_LENGTH && email.length <= MAX_EMAIL_LENGTH;

export {
  authErrorDetails,
  checkIsLoggedIn,
  getSession,
  getUserType,
  isEmailValid,
  isPasswordValid,
  refreshSession
};
