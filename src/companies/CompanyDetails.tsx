import Error from '../Error';
import JobsList from '../jobs/JobsList';
import LoadingModal from '../LoadingModal';
import Section from '../Section';
import useCompany from './useCompany';
import { findHeadquarters, isHeadquarters } from './utils';

const CompanyDetails = ({ id }: { id: number }) => {
  const { company, error, isPlaceholderData, isPending } = useCompany(id);

  if (error) {
    return <Error error={error} />;
  }

  if (isPending) {
    return <LoadingModal />;
  }

  if (!company) {
    return null;
  }

  const hq = findHeadquarters(company);

  return (
    <>
      {isPlaceholderData && <LoadingModal />}
      <Section title={company.name}>
        <div>
          {company.industryName}, {company.num_employees} employees
        </div>
        {hq && (
          <div>
            {hq.city}, {hq.state}
          </div>
        )}
      </Section>
      <Section title="Description">{company.description}</Section>
      <Section title="Offices">
        {company.addresses.length > 0 ? (
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
        <JobsList jobs={company.jobs} />
      </Section>
    </>
  );
};

export default CompanyDetails;
