import { MAX_NAME_LENGTH } from '../../companies/job_seeker/useCompanies';
import TextInput from '../../inputs/TextInput';
import type { ToInsert, ToUpdate } from '../utils';

const MyJobTitle = <T extends Partial<ToInsert> | ToUpdate>({
  title,
  handleUpdate
}: {
  title: string;
  handleUpdate: (value: React.SetStateAction<T>) => void;
}) => {
  return (
    <TextInput
      id="title"
      label="Title"
      value={title}
      maxLength={MAX_NAME_LENGTH}
      onChange={(title) =>
        handleUpdate((job) => ({
          ...job,
          title
        }))
      }
    />
  );
};

export default MyJobTitle;
