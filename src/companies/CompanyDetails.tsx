import Error from '../Error';
import useCompany from '../hooks/useCompany';
import useSkillsLite from '../hooks/useSkillsLite';
import useSkillVersionsLite from '../hooks/useSkillVersionsLite';
import JobsForCompany from '../jobs/JobsForCompany';
import LoadingModal from '../LoadingModal';
import SkillVersionLink from '../skills/SkillVersionLink';
import { findHeadquarters, isHeadquarters } from './companiesUtil';

const CompanyDetails = ({ id }: { id: number }) => {
  const { company, error, isPlaceholderData, isPending } = useCompany({ id });
  const { findSkill } = useSkillsLite();
  const { findSkillVersion } = useSkillVersionsLite();

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
    <div className="relative">
      {isPlaceholderData && <LoadingModal />}
      <h2>{company.name}</h2>
      <div className="flex flex-col">
        <div>
          {company.industry.name}, {company.num_employees} employees
        </div>
        {hq && (
          <div>
            {hq.city}, {hq.state}
          </div>
        )}
      </div>
      <hr className="my-4 border-gray-400 shadow" />
      <h2>Description</h2>
      <div>{company.description}</div>
      <hr className="my-4 border-gray-400 shadow" />
      <h2>Offices</h2>
      <div>
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
      <div>
        <ul>
          {company.techStack.map((techStackRow) => {
            const skillVersion = findSkillVersion(
              techStackRow.skill_version_id
            );
            if (!skillVersion) {
              return null;
            }
            const skill = findSkill(skillVersion.skill_id);
            if (!skill) {
              return null;
            }
            return (
              <li key={techStackRow.skill_version_id}>
                <SkillVersionLink skill={skill} skillVersion={skillVersion} />
              </li>
            );
          })}
        </ul>
      </div>
      <hr className="my-4 border-gray-400 shadow" />
      <h2>Jobs</h2>
      <div>
        <JobsForCompany company={company} />
      </div>
    </div>
  );
};

export default CompanyDetails;
