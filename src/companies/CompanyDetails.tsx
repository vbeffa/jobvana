import { useContext, useEffect } from 'react';
import { JobvanaContext } from '../Context';
import Error from '../Error';
import JobsList from '../jobs/JobsList';
import LoadingModal from '../LoadingModal';
import PillContainer from '../PillContainer';
import Section from '../Section';
import useCompany from './useCompany';
import { companyFields, findHeadquarters, isHeadquarters } from './utils';

const CompanyDetails = ({ id }: { id?: number }) => {
  const { setCompany } = useContext(JobvanaContext);
  const { company, error, isPlaceholderData, isPending } = useCompany(id);

  useEffect(() => {
    if (company) {
      setCompany(companyFields(company));
    }
  }, [company, setCompany]);

  if (error) {
    return <Error error={error} />;
  }

  if (isPending) {
    return <LoadingModal />;
  }

  if (!company) {
    return null;
  }

  const hq = company ? findHeadquarters(company) : undefined;

  return (
    <>
      {isPlaceholderData && <LoadingModal />}
      <Section title={company.name}>
        <div className="flex flex-row gap-1">
          {company && (
            <div className="pt-1 flex flex-row gap-2">
              <PillContainer>{company.industry.name}</PillContainer>
              <div className="content-center">
                {company.num_employees} employees
              </div>
            </div>
          )}
        </div>
        {hq && (
          <div className="pt-1">
            {hq.city}, {hq.state}
          </div>
        )}
      </Section>
      <Section title="Description">
        <div>
          {company && <div className="h-[87px]">{company.description}</div>}
        </div>
      </Section>
      <Section title="Offices">
        {company && company.addresses.length > 0 ? (
          <ul>
            {company.addresses.map((address) => (
              <li key={address.id}>
                {address.street} {address.city}, {address.state} {address.zip}
                {isHeadquarters(address) && ' (HQ)'}
              </li>
            ))}
          </ul>
        ) : null}
      </Section>
      <Section title="Current Jobs" isLast={true}>
        {(company && <JobsList jobs={company.jobs} />) ?? ''}
      </Section>
    </>
  );
};

export default CompanyDetails;
