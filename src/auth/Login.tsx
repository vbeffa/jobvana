import { Link } from '@tanstack/react-router';
import { useCallback, useMemo, useState } from 'react';
import Button from '../Button';
import { type UserType } from '../Context';
import Error from '../Error';
import TextInput from '../TextInput';
import supabase from '../utils/supabase';

const MIN_EMAIL_LENGTH = 6;
const MAX_EMAIL_LENGTH = 100;
const MIN_PASSWORD_LENGTH = 6;
const MAX_PASSWORD_LENGTH = 32;
const MAX_FIRST_NAME_LENGTH = 100;
const MAX_LAST_NAME_LENGTH = 100;

const REGISTER_REDIRECT_TO_DEV = 'http://localhost:5173/';
const REGISTER_REDIRECT_TO_PROD = 'https://vbeffa.github.io/jobvana/';

const Login = () => {
  const [mode, setMode] = useState<'register' | 'login'>('login');

  const [userType, setUserType] = useState<UserType | null>('company');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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
    setRegistrationSuccess(false);
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
          },
          emailRedirectTo: import.meta.env.DEV
            ? REGISTER_REDIRECT_TO_DEV
            : REGISTER_REDIRECT_TO_PROD
        }
      });

      if (error) {
        console.log(error);
        setError(error);
        return;
      }
      console.log(data);
      setRegistrationSuccess(true);
      resetForm();
      setMode('login');
    } finally {
      setIsLoggingIn(false);
    }
  }, [email, firstName, lastName, password, userType]);

  const doLogin = useCallback(async () => {
    setIsLoggingIn(true);
    setRegistrationSuccess(false);
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

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setFirstName('');
    setLastName('');
  };

  const activeModeStyle = 'border-b-3 border-b-blue-600';

  return (
    <div className="flex justify-center">
      <div
        className={`relative border-[0.5px] border-blue-300 rounded-lg w-[24rem] ${mode === 'register' ? 'h-[20.25rem]' : 'h-[11rem]'}`}
      >
        <div className="flex justify-center gap-8 mt-2 mb-2">
          <div className={mode === 'login' ? activeModeStyle : ''}>
            <Link
              to="."
              onClick={() => {
                setError(null);
                setMode('login');
                resetForm();
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
                resetForm();
              }}
            >
              Register
            </Link>
          </div>
        </div>
        <div className="border-b-[0.5px] border-blue-300" />
        <div className="grid grid-cols-[35%_65%] gap-y-2 mt-2 px-2">
          <TextInput
            id="email"
            label="Email"
            value={email}
            minLength={MIN_EMAIL_LENGTH}
            maxLength={mode === 'register' ? MAX_EMAIL_LENGTH : undefined}
            showLength={mode === 'register'}
            placeholder={
              mode === 'register' ? `Min ${MIN_EMAIL_LENGTH} characters` : ''
            }
            autoComplete="email"
            onChange={(email) => setEmail(email)}
          />
          <TextInput
            id="password"
            label="Password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            minLength={MIN_PASSWORD_LENGTH}
            maxLength={mode === 'register' ? MAX_PASSWORD_LENGTH : undefined}
            showEye={true}
            onClickEye={() => setShowPassword((showPassword) => !showPassword)}
            placeholder={
              mode === 'register' ? `Min ${MIN_PASSWORD_LENGTH} characters` : ''
            }
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
                value={firstName}
                maxLength={MAX_FIRST_NAME_LENGTH}
                autoComplete="given-name"
                onChange={setFirstName}
              />
              <TextInput
                id="last_name"
                label="Last name"
                value={lastName}
                maxLength={MAX_LAST_NAME_LENGTH}
                autoComplete="family-name"
                onChange={setLastName}
              />
              <div className="col-start-2 flex gap-2">
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
              <div className="col-start-2 flex gap-2">
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
        </div>
        <div className="flex justify-center mt-2">
          <Button
            label={mode === 'register' ? 'Sign Up' : 'Log In'}
            disabled={loginDisabled}
            onClick={() => (mode === 'register' ? doRegister() : doLogin())}
          />
        </div>
        <div className="col-span-2 flex justify-center text-sm mt-4">
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
