import TextInput from '../../TextInput';
import { MAX_NAME_LENGTH } from '../job_seeker/useCompanies';
import type { ToInsert, ToUpdate } from '../utils';

const CompanyName = <T extends Partial<ToInsert> | ToUpdate>({
  name,
  handleUpdate
}: {
  name?: string;
  handleUpdate: (value: React.SetStateAction<T>) => void;
}) => {
  return (
    <TextInput
      id="name"
      label="Name"
      value={name}
      maxLength={MAX_NAME_LENGTH}
      autoComplete="organization"
      onChange={(name) =>
        handleUpdate((company) => ({
          ...company,
          name
        }))
      }
    />
  );
};

export default CompanyName;
