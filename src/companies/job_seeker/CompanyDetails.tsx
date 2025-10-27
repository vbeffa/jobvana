import {
  FaArrowUpRightFromSquare,
  FaBuilding,
  FaLocationDot
} from 'react-icons/fa6';
import {
  ActionMenuContainer,
  LeftSide
} from '../../containers/ActionMenuContainer';
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
  const { company, isPending, isPlaceholderData, error } = useCompany(id);

  if (isPending) {
    return (
      <div className="relative top-10">
        <Modal type="loading" />
      </div>
    );
  }

  if (!company) {
    return null;
  }

  const hq = findHeadquarters(company);

  return (
    <>
      <div className="relative top-10">
        {isPlaceholderData && <Modal type="loading" />}
        {error && <JobvanaError error={error} />}
      </div>
      <ActionMenuContainer>
        <LeftSide>
          <FaBuilding />
          Company ID: {company.id}
        </LeftSide>
      </ActionMenuContainer>
      <div className="h-full px-4 pb-6 pt-2 overflow-auto">
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
            <div className="flex flex-row gap-1 items-center pt-1">
              <FaLocationDot />
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
                <li key={address.id} className="relative w-fit">
                  {address.street} {address.city}, {address.state} {address.zip}
                  {isHeadquarters(address) && ' (HQ)'}
                  <a
                    target="_blank"
                    href={`https://www.google.com/maps/place/${address.street} ${address.city} ${address.state} ${address.zip}`}
                  >
                    <FaArrowUpRightFromSquare className="absolute -right-5 top-[5px] text-sm" />
                  </a>
                </li>
              ))}
            </ul>
          ) : null}
        </Section>
        <Section title="Current Jobs">
          {<JobsList jobs={company.jobs} />}
        </Section>
        <Section title="Interview Process" isLast={true}>
          {company.interview_process ? (
            <div className="border-[0.5px] border-blue-300 rounded-lg mt-2 px-4 py-4">
              <InterviewProcessDisplay
                interviewProcess={company.interview_process}
                // totalApplications={company.totalApplications}
              />
              <div className="text-sm mt-2 text-justify hyphens-auto">
                Note: this is the current process as defined by the company and
                only applies to new jobs. Existing jobs may have a different
                process or pipeline.
              </div>
            </div>
          ) : null}
        </Section>
      </div>
    </>
  );
};

export default CompanyDetails;
