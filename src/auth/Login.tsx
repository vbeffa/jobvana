import { Link } from '@tanstack/react-router';
import { useCallback, useContext, useState } from 'react';
import Button from '../Button';
import { JobvanaContext } from '../Context';
import Error from '../Error';
import supabase from '../utils/supabase';

const Login = () => {
  const { authContext, setAuthContext, isLoggedIn } =
    useContext(JobvanaContext);
  const [mode, setMode] = useState<'register' | 'login'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [loginDisabled, setLoginDisabled] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  console.log(authContext);

  const doLogin = useCallback(async () => {
    console.log(email, password);
    setLoginDisabled(true);
    setError(null);
    if (mode === 'register') {
      const { data, error } = await supabase.auth.signUp({
        email,
        password
      });
      console.log(data, error);
      if (error) {
        setError(error);
      } else {
        setRegistrationSuccess(true);
      }
    } else {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      console.log(data, error);
      if (error) {
        setError(error);
      } else {
        setAuthContext({ ...data });
      }
    }
    setLoginDisabled(false);
  }, [email, mode, password, setAuthContext]);

  return (
    <div className="mt-8">
      {!isLoggedIn(authContext) && (
        <>
          <div className="grid grid-cols-3 gap-y-2 w-72">
            <div className="col-span-3 flex justify-center mb-2 gap-2">
              <Link
                to="."
                onClick={() => {
                  setError(null);
                  setMode('register');
                }}
              >
                Register
              </Link>
              <Link
                to="."
                onClick={() => {
                  setError(null);
                  setMode('login');
                }}
              >
                Log In
              </Link>
            </div>
            <label htmlFor="email" className="content-center">
              Email:
            </label>
            <input
              id="email"
              type="text"
              autoComplete="email"
              className="p-1 border-[0.5px] col-span-2"
              onChange={(e) => setEmail(e.target.value)}
            />
            <label htmlFor="password" className="content-center">
              Password:
            </label>
            <input
              id="password"
              type="password"
              autoComplete={
                mode === 'register' ? 'new-password' : 'current-password'
              }
              className="p-1 border-[0.5px] col-span-2"
              onChange={(e) => setPassword(e.target.value)}
            />
            <div className="col-span-3 flex justify-center mt-2">
              <Button
                label={mode === 'register' ? 'Sign Up' : 'Log In'}
                disabled={loginDisabled}
                onClick={doLogin}
              />
            </div>
            <div className="col-span-3 flex justify-center mt-2">
              {registrationSuccess && (
                <>Success! Please check your email for a verification link.</>
              )}
              {error && <Error error={error} />}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Login;
