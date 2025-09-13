import useIndustries from './useIndustries';

const IndustrySelect = ({
  elementId,
  industryId,
  onChange
}: {
  elementId: string;
  industryId?: number;
  onChange: (industryId: number | undefined) => void;
}) => {
  const { isPending, industries } = useIndustries();

  return (
    <select
      id={elementId}
      className="border border-gray-500 rounded-lg h-8 w-60 px-2 py-0.5"
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
      {!isPending && (
        <option key={0} value="">
          All
        </option>
      )}
      {industries?.map((industry, idx) => (
        <option key={idx} value={industry.id}>
          {industry.name}
        </option>
      ))}
    </select>
  );
};

export default IndustrySelect;
