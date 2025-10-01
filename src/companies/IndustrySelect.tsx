import Select from '../inputs/Select';
import useIndustries from './useIndustries';
import type { ToInsert, ToUpdate } from './utils';

export type IndustrySelectProps<T extends Partial<ToInsert> | ToUpdate> = {
  industryId?: number;
  width?: string;
  showAny?: boolean;
  showEmpty?: boolean;
  onChange?: (industryId: number | undefined) => void;
  handleUpdate?: (value: React.SetStateAction<T>) => void;
};

const IndustrySelect = <T extends Partial<ToInsert> | ToUpdate>({
  industryId,
  width,
  showAny = false,
  showEmpty = false,
  onChange,
  handleUpdate
}: IndustrySelectProps<T>) => {
  if (showAny && showEmpty) {
    throw new Error('cannot set both showAny and showEmpty');
  }

  const { isPending, industries } = useIndustries();

  return (
    <>
      <div>
        <Select
          id="industry"
          value={industryId}
          width={width}
          onChange={(e) => {
            const industryId = e.target.value
              ? parseInt(e.target.value)
              : undefined;
            if (onChange) {
              onChange(industryId);
            }
            if (handleUpdate) {
              handleUpdate((val) => {
                return {
                  ...val,
                  industry_id: industryId
                };
              });
            }
          }}
        >
          <>
            {isPending && (
              <option key={0} value={Number.NEGATIVE_INFINITY}>
                Loading...
              </option>
            )}
            {!isPending && showEmpty && <option key={0} value={-1} />}
            {!isPending && showAny && (
              <option key={0} value={0}>
                Any
              </option>
            )}
            {industries?.map((industry, idx) => (
              <option key={idx} value={industry.id}>
                {industry.name}
              </option>
            ))}
          </>
        </Select>
      </div>
    </>
  );
};

export default IndustrySelect;
