import TextInput from '../../inputs/TextInput';
import { MAX_EMAIL_LENGTH } from '../job_seeker/useCompanies';
import type { ToInsert, ToUpdate } from '../utils';

const CompanyEmail = <T extends Partial<ToInsert> | ToUpdate>({
  email,
  handleUpdate
}: {
  email?: string;
  handleUpdate: (value: React.SetStateAction<T>) => void;
}) => {
  return (
    <TextInput
      id="email"
      label="Email"
      value={email}
      maxLength={MAX_EMAIL_LENGTH}
      autoComplete="work email"
      onChange={(email) =>
        handleUpdate((company) => ({
          ...company,
          contact_email: email
        }))
      }
    />
  );
};

export default CompanyEmail;
