import type { Company } from '../types';
import type { SearchFilters } from './useCompanies';
import useIndustries from './useIndustries';
import type { ToInsert, ToUpdate } from './utils';

const IndustrySelect = <
  T extends
    | Partial<ToInsert>
    | ToUpdate
    | Partial<Company>
    | SearchFilters
    | null
    | undefined
>({
  industryId,
  showAll = true,
  showEmpty = false,
  onChange,
  handleUpdate
}: {
  industryId?: number;
  showAll?: boolean;
  showEmpty?: boolean;
  onChange?: (industryId: number | undefined) => void;
  handleUpdate?: (value: React.SetStateAction<T>) => void;
}) => {
  const { isPending, industries } = useIndustries();

  return (
    <>
      <label htmlFor="industry" className="content-center">
        Industry:
      </label>
      <div>
        <select
          id="industry"
          className="border-[0.5px] border-gray-500 h-8 w-full"
          value={industryId}
          onChange={(e) => {
            const industryId = e.target.value
              ? parseInt(e.target.value)
              : undefined;
            if (onChange) {
              onChange(industryId);
            }
            if (handleUpdate) {
              handleUpdate((val) => {
                if (!val) {
                  return val;
                }
                // SearchFilters uses industryId, db types use industry_id :/
                return {
                  ...val,
                  industryId,
                  industry_id: industryId
                };
              });
            }
          }}
        >
          {isPending && (
            <option key={0} value="">
              Loading...
            </option>
          )}
          {!isPending && showAll && (
            <option key={0} value="">
              All
            </option>
          )}
          {!isPending && showEmpty && <option key={0} value="" />}
          {industries?.map((industry, idx) => (
            <option key={idx} value={industry.id}>
              {industry.name}
            </option>
          ))}
        </select>
      </div>
    </>
  );
};

export default IndustrySelect;
