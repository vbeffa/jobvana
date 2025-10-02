import type { Session } from '@supabase/supabase-js';
import type { UserType } from '../Context';
import supabase from '../db/supabase';
import { MAX_PASSWORD_LENGTH, MIN_PASSWORD_LENGTH } from './Login';

const getSession = () => {
  const authToken = window.localStorage.getItem(
    `sb-${import.meta.env.VITE_SUPABASE_PROJECT_ID}-auth-token`
  );
  return authToken ? (JSON.parse(authToken) as Session) : null;
};

const isLoggedIn = () => {
  const session = getSession();
  return (
    session !== null &&
    session.expires_at !== undefined &&
    session.expires_at * 1000 > Date.now()
  );
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

const getUserType = (): UserType | undefined => {
  const session = getSession();

  return session?.user.user_metadata.type as UserType;
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

  const authResponse = await supabase.auth.refreshSession({
    refresh_token: session.refresh_token
  });
  if (authResponse.error) {
    console.log(authResponse.error);
  }
};

const isPasswordValid = (password: string) =>
  password.length >= MIN_PASSWORD_LENGTH &&
  password.length <= MAX_PASSWORD_LENGTH;

export { getSession, getUserType, isLoggedIn, isPasswordValid, refreshSession };
