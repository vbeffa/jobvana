import type { ToInsert, ToUpdate } from '../jobs/utils';
import TextInput from '../TextInput';
import { MAX_NAME_LENGTH } from './useCompanies';

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
