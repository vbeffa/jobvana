import JobvanaError from '../JobvanaError';
import type { SkillCategory } from '../types';
import SkillCategoryLink from './SkillCategoryLink';
import useSkillsForCategory from './useSkillsForCategory';

export type SkillCategoryLinkWithNumSkillsProps = Pick<
  SkillCategory,
  'id' | 'name'
>;

const SkillCategoryLinkWithNumSkills = ({
  id,
  name
}: SkillCategoryLinkWithNumSkillsProps) => {
  const { skillsCount, error } = useSkillsForCategory({
    skillCategoryId: id,
    countOnly: true,
    params: { paging: { page: 1, pageSize: 10 }, filters: {} }
  });

  const numSkillsString = skillsCount
    ? ` (${skillsCount} skill${skillsCount > 1 ? 's' : ''})`
    : null;

  return (
    <>
      {error && <JobvanaError error={error} />}
      <SkillCategoryLink id={id} name={name} />
      {numSkillsString}
    </>
  );
};

export default SkillCategoryLinkWithNumSkills;
