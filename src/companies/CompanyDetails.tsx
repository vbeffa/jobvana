import Error from '../Error';
import JobsList from '../jobs/JobsList';
import LoadingModal from '../LoadingModal';
import SkillVersionLink from '../skills/SkillVersionLink';
import useSkillsLite from '../skills/useSkillsLite';
import useCompany from './useCompany';
import { findHeadquarters, isHeadquarters } from './utils';

const CompanyDetails = ({ id }: { id: number }) => {
  const { company, error, isPlaceholderData, isPending } = useCompany(id);
  const { findSkill } = useSkillsLite();

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
      <h2>{company.name}</h2>
      <div className="flex flex-col h-12">
        <div>
          {company.industryName}, {company.num_employees} employees
        </div>
        {hq && (
          <div>
            {hq.city}, {hq.state}
          </div>
        )}
      </div>
      <hr className="my-4 border-gray-400 shadow" />
      <h2>Description</h2>
      <div className="h-12">{company.description}</div>
      <hr className="my-4 border-gray-400 shadow" />
      <h2>Offices</h2>
      <div className="h-12 overflow-scroll">
        {company.addresses.length > 0 && (
          <ul>
            {company.addresses.map((address) => (
              <li key={address.id}>
                {address.street} {address.city}, {address.state} {address.zip}
                {isHeadquarters(address) && ' (HQ)'}
              </li>
            ))}
          </ul>
        )}
      </div>
      <hr className="my-4 border-gray-400 shadow" />
      <h2>Tech Stack</h2>
      <div className="h-12">
        <ul>
          {company.techStack.map((techStackRow) => {
            const skill = findSkill(techStackRow.skill_id);
            if (!skill) {
              return null;
            }
            return (
              <li key={techStackRow.id}>
                <SkillVersionLink {...skill} {...techStackRow} />
              </li>
            );
          })}
        </ul>
      </div>
      <hr className="my-4 border-gray-400 shadow" />
      <h2>Current Jobs</h2>
      <div>
        <JobsList jobs={company.jobs} />
      </div>
    </>
  );
};

export default CompanyDetails;
