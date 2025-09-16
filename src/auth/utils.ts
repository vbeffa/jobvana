import type { Session } from '@supabase/supabase-js';
import { PROJECT_ID } from '../Root';
import supabase from '../utils/supabase';

const getSession = () => {
  const authToken = window.localStorage.getItem(`sb-${PROJECT_ID}-auth-token`);
  return authToken ? (JSON.parse(authToken) as Session) : null;
};

const getUserType = async (userId?: string) => {
  if (!userId) {
    return undefined;
  }
  const { data } = await supabase
    .from('users')
    .select('type')
    .filter('user_id', 'eq', userId);
  return data?.[0].type;
};

export { getSession, getUserType };
