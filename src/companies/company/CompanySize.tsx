import NumberInput from '../../inputs/NumberInput';
import { MAX_COMPANY_SIZE, MIN_COMPANY_SIZE } from '../job_seeker/useCompanies';
import type { ToInsert, ToUpdate } from '../utils';

const CompanySize = <T extends Partial<ToInsert> | ToUpdate>({
  id = 'num_employees',
  label,
  size,
  onChange,
  handleUpdate
}: {
  id?: string;
  label?: string;
  size?: number;
  onChange?: (size: number | null) => void;
  handleUpdate?: (value: React.SetStateAction<T>) => void;
}) => {
  return (
    <NumberInput
      id={id}
      label={label}
      value={size ?? null}
      min={MIN_COMPANY_SIZE}
      max={MAX_COMPANY_SIZE}
      onChange={(size) => {
        if (onChange) {
          onChange(size);
        }
        if (handleUpdate) {
          handleUpdate((company) => ({
            ...company,
            num_employees: size ?? undefined
          }));
        }
      }}
    />
  );
};

export default CompanySize;
