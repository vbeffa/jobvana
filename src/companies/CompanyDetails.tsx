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
    <div className="">
      {isPlaceholderData && <LoadingModal />}
      <h2>{company.name}</h2>
      <h2>Description</h2>
      <div className="card text-left">{company.description}</div>
      <h2>Industry</h2>
      <div className="card text-left">{company.industry.name}</div>
      <h2>Size</h2>
      <div className="card text-left">{company.num_employees}</div>
      <h2>Headquarters</h2>
      <div className="card text-left">
        {hq && (
          <>
            {hq.street} {hq.city}, {hq.state} {hq.zip}
          </>
        )}
      </div>
      <h2>Offices</h2>
      <div className="card text-left">
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
      <h2>Tech Stack</h2>
      <div className="card text-left">
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
      <h2>Jobs</h2>
      <div className="card text-left">
        <JobsForCompany company={company} />
      </div>
    </div>
  );
};

export default CompanyDetails;
