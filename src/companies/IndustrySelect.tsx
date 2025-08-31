import useIndustries from '../hooks/useIndustries';

const IndustrySelect = ({
  id,
  industryId,
  onChange
}: {
  id: string;
  industryId?: number;
  onChange: (industryId: number) => void;
}) => {
  const { isPending, industries } = useIndustries();

  return (
    <select
      id={id}
      className="border border-gray-500 rounded-lg h-8 w-60 px-2 py-0.5"
      value={industryId}
      onChange={(e) => onChange(parseInt(e.target.value))}
    >
      {isPending && (
        <option key={0} value="">
          Loading...
        </option>
      )}
      {!isPending && <option key={0} value=""></option>}
      {industries?.map((industry, idx) => (
        <option key={idx} value={industry.id}>
          {industry.name}
        </option>
      ))}
    </select>
  );
};

export default IndustrySelect;
