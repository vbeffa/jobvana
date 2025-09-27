import NumberInput from '../../inputs/NumberInput';
import { MAX_COMPANY_SIZE, MIN_COMPANY_SIZE } from '../job_seeker/useCompanies';
import type { ToInsert, ToUpdate } from '../utils';

const CompanySizeEdit = <T extends Partial<ToInsert> | ToUpdate>({
  id = 'num_employees',
  size,
  handleUpdate
}: {
  id?: string;
  size?: number;
  handleUpdate: (value: React.SetStateAction<T>) => void;
}) => {
  return (
    <NumberInput
      id={id}
      label="Num employees"
      value={size ?? null}
      min={MIN_COMPANY_SIZE}
      max={MAX_COMPANY_SIZE}
      width="w-fit"
      onChange={(size) => {
        handleUpdate((company) => ({
          ...company,
          num_employees: size ?? undefined
        }));
      }}
    />
  );
};

export default CompanySizeEdit;
