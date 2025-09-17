import useIndustries from './useIndustries';

const IndustrySelect = ({
  id,
  label,
  industryId,
  showAll = true,
  showEmpty = false,
  onChange
}: {
  id: string;
  label?: string;
  industryId?: number;
  showAll?: boolean;
  showEmpty?: boolean;
  onChange: (industryId: number | undefined) => void;
}) => {
  const { isPending, industries } = useIndustries();

  return (
    <>
      <label htmlFor={id} className="content-center">
        {label}:
      </label>
      <select
        id={id}
        className="border-[0.5px] h-8 px-2 py-0.5 col-span-2"
        value={industryId}
        onChange={(e) =>
          onChange(e.target.value ? parseInt(e.target.value) : undefined)
        }
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
    </>
  );
};

export default IndustrySelect;
