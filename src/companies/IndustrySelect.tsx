import useIndustries from './useIndustries';
import type { ToInsert, ToUpdate } from './utils';

const IndustrySelect = <T extends Partial<ToInsert> | ToUpdate>({
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
  if (showAll && showEmpty) {
    throw new Error('cannot set both showAll and showEmpty');
  }

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
                if (val === undefined || val === null) {
                  return val;
                }
                return {
                  ...val,
                  industry_id: industryId
                };
              });
            }
          }}
        >
          {isPending && (
            <option key={0} value={Number.NEGATIVE_INFINITY}>
              Loading...
            </option>
          )}
          {!isPending && showEmpty && <option key={0} value={-1} />}
          {!isPending && showAll && (
            <option key={0} value={0}>
              All
            </option>
          )}
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
