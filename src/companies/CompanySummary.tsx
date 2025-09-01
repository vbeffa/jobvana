import type { Company } from '../hooks/useCompanies';

const CompanySummary = ({
  company,
  selected,
  onClick
}: {
  company: Company;
  selected: boolean;
  onClick: () => void;
}) => {
  return (
    <div
      key={company.id}
      className={`h-16 p-2 ${selected ? 'bg-gray-200' : ''} cursor-pointer`}
      onClick={onClick}
    >
      <div className="text-blue-500">{company.name}</div>
      <div className="text-sm">{company.industry.name}</div>
    </div>
  );
};

export default CompanySummary;
