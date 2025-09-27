import TextInput from '../../inputs/TextInput';
import { MAX_TITLE_LENGTH } from '../job_seekers/useJobs';
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
      maxLength={MAX_TITLE_LENGTH}
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
