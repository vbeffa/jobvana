import type { Company } from '../types';
import NumberInput from './NumberInput';
import type { ToInsert, ToUpdate } from './utils';

const CompanySize = <
  T extends Partial<ToInsert> | ToUpdate | Partial<Company> | null | undefined
>({
  size,
  handleUpdate
}: {
  size?: number;
  handleUpdate: (value: React.SetStateAction<T>) => void;
}) => {
  return (
    <NumberInput
      id="num_employees"
      label="Num employees"
      size={size ?? null}
      onChange={(size) =>
        handleUpdate((company) => ({
          ...company,
          num_employees: size ?? undefined
        }))
      }
    />
  );
};

export default CompanySize;
