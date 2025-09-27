import { useContext, useEffect } from 'react';
import PillContainer from '../../containers/PillContainer';
import { JobvanaContext } from '../../Context';
import Error from '../../Error';
import JobsList from '../../jobs/JobsList';
import LoadingModal from '../../LoadingModal';
import Section from '../../Section';
import type { InterviewProcess } from '../company/utils';
import CompanyEmailDisplay from '../CompanyEmailDisplay';
import InterviewProcessDisplay from '../InterviewProcessDisplay';
import { companyFields, findHeadquarters, isHeadquarters } from '../utils';
import useCompany from './useCompany';

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
            </div>
          )}
        </div>
        <div className="content-center">
          {company.num_employees} employee{company.num_employees > 1 && 's'}
        </div>
        {hq && (
          <div className="pt-1">
            {hq.city}, {hq.state}
          </div>
        )}
        <div>
          <CompanyEmailDisplay {...company} />
        </div>
      </Section>
      <Section title="Description">{company.description}</Section>
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
      <Section title="Current Jobs">
        {company ? <JobsList jobs={company.jobs} /> : null}
      </Section>
      <Section title="Interview Process" isLast={true}>
        {company.interview_process ? (
          <div className="border-[0.5px] border-blue-300 rounded-lg w-[600px] mt-2 p-2 flex flex-col gap-2">
            <InterviewProcessDisplay
              interviewProcess={company.interview_process as InterviewProcess}
            />
          </div>
        ) : null}
      </Section>
    </>
  );
};

export default CompanyDetails;
