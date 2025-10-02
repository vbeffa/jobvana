import { Link } from '@tanstack/react-router';
import { useCallback, useMemo, useState } from 'react';
import {
  MAX_EMAIL_LENGTH,
  MIN_EMAIL_LENGTH
} from '../companies/job_seeker/useCompanies';
import { type UserType } from '../Context';
import Button from '../controls/Button';
import supabase from '../db/supabase';
import TextInput from '../inputs/TextInput';
import JobvanaError from '../JobvanaError';
import { isEmailValid, isPasswordValid } from './utils';

export const MIN_PASSWORD_LENGTH = 6;
export const MAX_PASSWORD_LENGTH = 32;
const MAX_FIRST_NAME_LENGTH = 100;
const MAX_LAST_NAME_LENGTH = 100;

const REGISTER_REDIRECT_TO_DEV = 'http://localhost:5173/jobvana';
const REGISTER_REDIRECT_TO_PROD = 'https://vbeffa.github.io/jobvana/';
const RESET_PASSWORD_REDIRECT_TO_DEV = 'http://localhost:5173/jobvana/account';
const RESET_PASSWORD_REDIRECT_TO_PROD =
  'https://vbeffa.github.io/jobvana/account';

const Login = () => {
  const [mode, setMode] = useState<'register' | 'login' | 'forgot_password'>(
    'login'
  );

  const [userType, setUserType] = useState<UserType | null>('company');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const submitDisabled = useMemo(
    () =>
      isSubmitting ||
      !isEmailValid(email) ||
      (mode !== 'forgot_password' && !isPasswordValid(password)) ||
      (mode === 'register' && (!userType || !firstName || !lastName)),
    [email, firstName, isSubmitting, lastName, mode, password, userType]
  );

  const doRegister = useCallback(async () => {
    setIsSubmitting(true);
    setSuccessMessage('');
    setError(null);

    try {
      const { error } = await supabase.auth.signUp({
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
      setSuccessMessage(
        'Success! Please check your email for a verification link.'
      );
      resetForm();
      setMode('login');
    } finally {
      setIsSubmitting(false);
    }
  }, [email, firstName, lastName, password, userType]);

  const doLogin = useCallback(async () => {
    setIsSubmitting(true);
    setSuccessMessage('');
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        console.log(error);
        setError(error);
      }
    } finally {
      setIsSubmitting(false);
    }

    // window.dispatchEvent(new Event('login'));
  }, [email, password]);

  const doResetPassword = useCallback(async () => {
    setIsSubmitting(true);
    setSuccessMessage('');
    setError(null);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: import.meta.env.DEV
          ? RESET_PASSWORD_REDIRECT_TO_DEV
          : RESET_PASSWORD_REDIRECT_TO_PROD
      });

      if (error) {
        console.log(error);
        setError(error);
        return;
      }
      setSuccessMessage(
        'Email sent. Please check your email for a reset link.'
      );
      resetForm();
      setMode('login');
    } finally {
      setIsSubmitting(false);
    }
  }, [email]);

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setFirstName('');
    setLastName('');
  };

  const activeModeStyle = 'border-b-3 border-b-blue-600';
  const inactiveModeStyle = 'border-b-3 border-white';

  return (
    <div className="flex justify-center">
      <div
        className={`relative border-[0.5px] border-blue-300 rounded-lg w-[24rem] ${mode === 'register' ? 'h-[20.25rem]' : 'h-[11rem]'}`}
      >
        <div className="flex justify-center gap-8 mt-2 mb-2">
          <div
            className={mode === 'login' ? activeModeStyle : inactiveModeStyle}
          >
            <Link
              to="."
              onClick={() => {
                setError(null);
                setSuccessMessage('');
                setMode('login');
                resetForm();
              }}
            >
              Log In
            </Link>
          </div>
          <div
            className={
              mode === 'register' ? activeModeStyle : inactiveModeStyle
            }
          >
            <Link
              to="."
              onClick={() => {
                setError(null);
                setSuccessMessage('');
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
          {mode !== 'forgot_password' && (
            <TextInput
              id="password"
              label="Password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              minLength={MIN_PASSWORD_LENGTH}
              maxLength={mode === 'register' ? MAX_PASSWORD_LENGTH : undefined}
              showEye={true}
              onClickEye={() =>
                setShowPassword((showPassword) => !showPassword)
              }
              placeholder={
                mode === 'register'
                  ? `Min ${MIN_PASSWORD_LENGTH} characters`
                  : ''
              }
              autoComplete={
                mode === 'register' ? 'new-password' : 'current-password'
              }
              onChange={(password) => setPassword(password)}
            />
          )}
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
        <div
          className={`flex justify-center ${mode === 'forgot_password' ? 'mt-12' : 'mt-2'}`}
        >
          <Button
            label={
              mode === 'login'
                ? 'Login'
                : mode === 'register'
                  ? 'Sign Up'
                  : 'Send Email'
            }
            disabled={submitDisabled}
            onClick={() =>
              mode === 'login'
                ? doLogin()
                : mode === 'register'
                  ? doRegister()
                  : doResetPassword()
            }
          />
        </div>
        {mode !== 'forgot_password' && !successMessage && (
          <div className="col-span-2 flex justify-end text-sm mt-4 pr-0.5">
            <Link
              to="."
              onClick={() => {
                setError(null);
                setSuccessMessage('');
                setMode('forgot_password');
                resetForm();
              }}
            >
              Forgot Password?
            </Link>
          </div>
        )}
        <div className="col-span-2 flex justify-center text-sm mt-4">
          {successMessage && successMessage}
          {error && <JobvanaError error={error} />}
        </div>
      </div>
    </div>
  );
};

export default Login;
