import PillContainer from '../../containers/PillContainer';
import JobsList from '../../jobs/job_seekers/JobsList';
import JobvanaError from '../../JobvanaError';
import Modal from '../../Modal';
import Section from '../../Section';
import CompanyEmailDisplay from '../CompanyEmailDisplay';
import InterviewProcessDisplay from '../InterviewProcessDisplay';
import { findHeadquarters, isHeadquarters } from '../utils';
import useCompany from './useCompany';

const CompanyDetails = ({ id }: { id?: number }) => {
  const { company, error, isPlaceholderData, isPending } = useCompany(id);

  if (error) {
    return <JobvanaError error={error} />;
  }

  if (isPending) {
    return <Modal type="loading" />;
  }

  if (!company) {
    return null;
  }

  const hq = findHeadquarters(company);

  return (
    <div className="mx-4">
      {isPlaceholderData && <Modal type="loading" />}
      <Section title={company.name}>
        <div className="flex flex-row gap-1">
          {
            <div className="pt-1 flex flex-row gap-2">
              <PillContainer>{company.industry.name}</PillContainer>
            </div>
          }
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
      <Section title="Current Jobs">{<JobsList jobs={company.jobs} />}</Section>
      <Section title="Interview Process" isLast={true}>
        {company.interview_process ? (
          <div className="border-[0.5px] border-blue-300 rounded-lg w-fit mt-2 px-4 py-4">
            <InterviewProcessDisplay
              interviewProcess={company.interview_process}
            />
          </div>
        ) : null}
      </Section>
    </div>
  );
};

export default CompanyDetails;
