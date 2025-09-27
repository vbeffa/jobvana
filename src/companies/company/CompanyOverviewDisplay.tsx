import CompanyEmailDisplay from '../CompanyEmailDisplay';
import useIndustries from '../useIndustries';
import type { ToDisplay } from '../utils';

export type CompanyOverviewDisplayProps = {
  company: ToDisplay;
};

// TODO decide if this should be used for job seekers as well
const CompanyOverviewDisplay = ({ company }: CompanyOverviewDisplayProps) => {
  const { findIndustry } = useIndustries();

  return (
    <>
      <div>Name:</div>
      <div>{company.name}</div>
      <div>Industry:</div>
      <div>{findIndustry(company.industry_id)?.name}</div>
      <div>Num employees:</div>
      <div>{company.num_employees}</div>
      <div>Contact email:</div>
      <div>
        <CompanyEmailDisplay {...company} />
      </div>
      <div>Description:</div>
      <div>{company.description}</div>
    </>
  );
};

export default CompanyOverviewDisplay;
