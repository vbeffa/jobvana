import { MAX_NAME_LENGTH } from '../companies/job_seeker/useCompanies';
import Label from '../inputs/Label';
import TextInput from '../inputs/TextInput';
import type { ToInsert, ToUpdate } from './utils';

export type ProfileEditProps<T extends ToUpdate | ToInsert> = {
  jobSeeker: T;
  setJobSeeker: React.Dispatch<React.SetStateAction<T>>;
  isOnboarding?: boolean;
};

const ProfileEdit = <T extends ToUpdate | ToInsert>({
  jobSeeker,
  setJobSeeker
}: ProfileEditProps<T>) => {
  return (
    <div className="grid grid-cols-[25%_75%] w-[400px] gap-2">
      <Label htmlFor="first_name" label="First name" />
      <TextInput
        id="first_name"
        value={jobSeeker.first_name}
        maxLength={MAX_NAME_LENGTH}
        autoComplete="given-name"
        onChange={(first_name) => {
          setJobSeeker((jobSeeker) => ({
            ...jobSeeker,
            first_name
          }));
        }}
      />
      <Label htmlFor="last_name" label="Last name" />
      <TextInput
        id="last_name"
        value={jobSeeker.last_name}
        maxLength={MAX_NAME_LENGTH}
        autoComplete="family-name"
        onChange={(last_name) => {
          setJobSeeker((jobSeeker) => ({
            ...jobSeeker,
            last_name
          }));
        }}
      />
    </div>
  );
};

export default ProfileEdit;
