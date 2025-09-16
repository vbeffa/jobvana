import { Link } from '@tanstack/react-router';
import { useCallback, useContext, useState } from 'react';
import Button from '../Button';
import { JobvanaContext, type UserType } from '../Context';
import Error from '../Error';
import TextInput from '../TextInput';
import supabase from '../utils/supabase';

const Login = () => {
  const { loggedIn } = useContext(JobvanaContext);
  const [mode, setMode] = useState<'register' | 'login'>('login');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [userType, setUserType] = useState<UserType | null>(null);

  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [loginDisabled, setLoginDisabled] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const doLogin = useCallback(async () => {
    console.log(email, password);
    setLoginDisabled(true);
    setError(null);
    if (mode === 'register') {
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
        window.dispatchEvent(new Event('login'));
      }
    }
    setLoginDisabled(false);
  }, [email, firstName, lastName, mode, password, userType]);

  const activeModeStyle = 'border-b-3 border-b-blue-600';

  return (
    <div className="mt-4">
      {loggedIn === false && (
        <>
          <div className="grid grid-cols-3 gap-y-2 w-72">
            <div className="col-span-3 flex justify-center mb-2 gap-16">
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
                <div></div>
                <div className="col-span-2 flex justify-start mt-2 gap-2">
                  <input
                    id="company_checkbox"
                    name="registration_type"
                    type="radio"
                    onClick={() => setUserType('company')}
                  />
                  <label htmlFor="company_checkbox" className="content-center">
                    I represent a company
                  </label>
                </div>
                <div></div>
                <div className="col-span-2 flex justify-start mb-2 gap-2">
                  <input
                    id="job_seeker_checkbox"
                    name="registration_type"
                    type="radio"
                    onClick={() => setUserType('job_seeker')}
                  />
                  <label
                    htmlFor="job_seeker_checkbox"
                    className="content-center"
                  >
                    I am a job seeker
                  </label>
                </div>
              </>
            )}
            <div className="col-span-3 flex justify-center mt-2">
              <Button
                label={mode === 'register' ? 'Sign Up' : 'Log In'}
                disabled={
                  mode === 'register'
                    ? !email ||
                      !password ||
                      !firstName ||
                      !lastName ||
                      !userType ||
                      loginDisabled
                    : loginDisabled
                }
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
