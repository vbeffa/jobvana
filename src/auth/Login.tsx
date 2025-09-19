import { Link } from '@tanstack/react-router';
import { useCallback, useMemo, useState } from 'react';
import Button from '../Button';
import { type UserType } from '../Context';
import Error from '../Error';
import TextInput from '../TextInput';
import supabase from '../utils/supabase';

const MIN_PASSWORD_LENGTH = 6;
const MAX_PASSWORD_LENGTH = 32;

const Login = () => {
  const [mode, setMode] = useState<'register' | 'login'>('login');

  const [userType, setUserType] = useState<UserType | null>('company');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const loginDisabled = useMemo(
    () =>
      isLoggingIn ||
      !email ||
      !password ||
      password.length < MIN_PASSWORD_LENGTH ||
      password.length > MAX_PASSWORD_LENGTH ||
      (mode === 'register' && (!userType || !firstName || !lastName)),
    [email, firstName, isLoggingIn, lastName, mode, password, userType]
  );

  const doRegister = useCallback(async () => {
    setIsLoggingIn(true);
    setError(null);

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
            type: userType
          }
        }
      });

      if (error) {
        console.log(error);
        setError(error);
        return;
      }
      console.log(data);
      setRegistrationSuccess(true);
    } finally {
      setIsLoggingIn(false);
    }
  }, [email, firstName, lastName, password, userType]);

  const doLogin = useCallback(async () => {
    setIsLoggingIn(true);
    setError(null);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        console.log(error);
        setError(error);
        return;
      }
      console.log(data);
    } finally {
      setIsLoggingIn(false);
    }

    window.dispatchEvent(new Event('login'));
  }, [email, password]);

  const activeModeStyle = 'border-b-3 border-b-blue-600';

  return (
    <div className="mt-4 flex justify-center">
      <div className="grid grid-cols-[35%_65%] w-[24rem] gap-2">
        <div className="col-span-2 flex justify-center gap-8 mb-2">
          <div className={mode === 'login' ? activeModeStyle : ''}>
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
          <div className={mode === 'register' ? activeModeStyle : ''}>
            <Link
              to="."
              onClick={() => {
                setError(null);
                setMode('register');
              }}
            >
              Register
            </Link>
          </div>
        </div>
        <TextInput
          id="email"
          label="Email"
          autoComplete="email"
          onChange={(email) => setEmail(email)}
        />
        <TextInput
          id="password"
          label="Password"
          type="password"
          value={password}
          minLength={MIN_PASSWORD_LENGTH}
          maxLength={mode === 'register' ? MAX_PASSWORD_LENGTH : undefined}
          placeholder={mode === 'register' ? 'Min 6 characters' : ''}
          autoComplete={
            mode === 'register' ? 'new-password' : 'current-password'
          }
          onChange={(password) => setPassword(password)}
        />
        {mode === 'register' && (
          <>
            <TextInput
              id="first_name"
              label="First name"
              autoComplete="given-name"
              onChange={setFirstName}
            />
            <TextInput
              id="last_name"
              label="Last name"
              autoComplete="family-name"
              onChange={setLastName}
            />
            <div className="col-start-2 flex justify-start gap-2">
              <input
                id="company_checkbox"
                name="registration_type"
                type="radio"
                checked={userType === 'company'}
                onChange={() => setUserType('company')}
              />
              <label htmlFor="company_checkbox" className="content-center">
                I represent a company
              </label>
            </div>
            <div className="col-start-2 flex justify-start gap-2">
              <input
                id="job_seeker_checkbox"
                name="registration_type"
                type="radio"
                checked={userType === 'job_seeker'}
                onChange={() => setUserType('job_seeker')}
              />
              <label htmlFor="job_seeker_checkbox" className="content-center">
                I am a job seeker
              </label>
            </div>
          </>
        )}
        <div className="col-span-2 flex justify-center mt-2">
          <Button
            label={mode === 'register' ? 'Sign Up' : 'Log In'}
            disabled={loginDisabled}
            onClick={() => (mode === 'register' ? doRegister() : doLogin())}
          />
        </div>
        <div className="col-span-2 flex justify-center mt-2">
          {registrationSuccess && (
            <>Success! Please check your email for a verification link.</>
          )}
          {error && <Error error={error} />}
        </div>
      </div>
    </div>
  );
};

export default Login;
