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
  handleUpdate
}: {
  industryId?: number;
  showAll?: boolean;
  showEmpty?: boolean;
  handleUpdate: (value: React.SetStateAction<T>) => void;
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
          className="border-[0.5px] h-8 w-full"
          value={industryId}
          onChange={(e) => {
            handleUpdate((val) => {
              const industryId = e.target.value
                ? parseInt(e.target.value)
                : undefined;
              if (!val) {
                return val;
              }
              if ('industryId' in val) {
                return {
                  ...val,
                  industryId
                };
              }
              return {
                ...val,
                industry_id: industryId
              };
            });
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
