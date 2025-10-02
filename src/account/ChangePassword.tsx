import { useCallback, useMemo, useState } from 'react';
import { MAX_PASSWORD_LENGTH, MIN_PASSWORD_LENGTH } from '../auth/Login';
import { getSession, isPasswordValid } from '../auth/utils';
import Button from '../controls/Button';
import supabase from '../db/supabase';
import Label from '../inputs/Label';
import TextInput from '../inputs/TextInput';
import JobvanaError from '../JobvanaError';

const ChangePassword = () => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [changePasswordSuccess, setChangePasswordSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const submitDisabled = useMemo(
    () =>
      isSubmitting ||
      !isPasswordValid(password) ||
      !isPasswordValid(newPassword) ||
      !isPasswordValid(confirmPassword) ||
      password.localeCompare(newPassword) === 0 || // can't use same password
      newPassword.localeCompare(confirmPassword) !== 0, // new passwords must match
    [confirmPassword, isSubmitting, newPassword, password]
  );

  const changePassword = useCallback(async () => {
    setIsSubmitting(true);
    setChangePasswordSuccess(false);
    setError(null);

    const session = getSession();
    const email = session?.user.email;
    if (!email) {
      setError(Error('Email missing from session'));
      return;
    }

    try {
      const result = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (result.error) {
        console.log(result.error);
        setError(Error('Current password invalid'));
        return;
      }

      const result2 = await supabase.auth.updateUser({
        password: newPassword
      });

      if (result2.error) {
        console.log(result2.error);
        setError(result2.error);
        return;
      }
      // console.log(data);
      setChangePasswordSuccess(true);
      resetForm();
    } finally {
      setIsSubmitting(false);
    }
  }, [newPassword, password]);

  const resetForm = () => {
    setPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="flex flex-col gap-y-2">
      <div className="grid grid-cols-[40%_60%] w-[400px] gap-2">
        <Label htmlFor="password" label="Current password" />
        <TextInput
          id="password"
          // label="Current password"
          width="w-60"
          type={showPassword ? 'text' : 'password'}
          value={password}
          showEye={true}
          onClickEye={() => setShowPassword((showPassword) => !showPassword)}
          autoComplete={'current-password'}
          onChange={(password) => setPassword(password)}
        />
      </div>
      <div className="grid grid-cols-[40%_60%] w-[400px] gap-2">
        <Label htmlFor="new_password" label="New password" />
        <TextInput
          id="new_password"
          // label="New password"
          width="w-60"
          type={showNewPassword ? 'text' : 'password'}
          value={newPassword}
          minLength={MIN_PASSWORD_LENGTH}
          maxLength={MAX_PASSWORD_LENGTH}
          showEye={true}
          onClickEye={() => setShowNewPassword((showPassword) => !showPassword)}
          placeholder={`Min ${MIN_PASSWORD_LENGTH} characters`}
          autoComplete={'new-password'}
          onChange={(password) => setNewPassword(password)}
        />
      </div>
      <div className="grid grid-cols-[40%_60%] w-[400px] gap-2">
        <Label htmlFor="confirm_new_password" label="Confirm password" />
        <TextInput
          id="confirm_new_password"
          // label="New password"
          width="w-60"
          type={showConfirmPassword ? 'text' : 'password'}
          value={confirmPassword}
          minLength={MIN_PASSWORD_LENGTH}
          maxLength={MAX_PASSWORD_LENGTH}
          showEye={true}
          onClickEye={() =>
            setShowConfirmPassword((showPassword) => !showPassword)
          }
          placeholder={`Min ${MIN_PASSWORD_LENGTH} characters`}
          autoComplete={'new-password'}
          onChange={(password) => setConfirmPassword(password)}
        />
      </div>
      <div className="grid grid-cols-2 mt-4">
        <div className="flex justify-center">
          <Button
            label="Submit"
            disabled={submitDisabled}
            onClick={changePassword}
          />
        </div>
      </div>
      <div className="grid grid-cols-2 text-sm mt-2">
        <div className="flex justify-center">
          {changePasswordSuccess && <>Password successfully changed.</>}
          {error && <JobvanaError error={error} />}
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
