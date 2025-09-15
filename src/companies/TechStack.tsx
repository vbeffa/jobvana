import SkillVersionLink from '../skills/SkillVersionLink';
import useSkillsLite from '../skills/useSkillsLite';
import type { FullCompany } from './useCompany';

export type CompanyLinkProps = Pick<FullCompany, 'techStack'>;

const TechStack = ({ techStack }: CompanyLinkProps) => {
  const { findSkill } = useSkillsLite();

  return (
    <ul>
      {techStack.map((techStackRow) => {
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
  );
};

export default TechStack;
