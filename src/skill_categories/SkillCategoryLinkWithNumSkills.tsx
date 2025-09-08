import Error from '../Error';
import type { SkillCategory } from '../hooks/types';
import useSkillsForCategory from '../hooks/useSkillsForCategory';
import SkillCategoryLink from './SkillCategoryLink';

export type SkillCategoryLinkWithNumSkillsProps = Pick<
  SkillCategory,
  'id' | 'name'
>;

const SkillCategoryLinkWithNumSkills = ({
  id,
  name
}: SkillCategoryLinkWithNumSkillsProps) => {
  const { skillsCount, error } = useSkillsForCategory(id, true);

  const numSkillsString = skillsCount
    ? ` (${skillsCount} skill${skillsCount > 1 ? 's' : ''})`
    : null;

  return (
    <>
      {error && <Error error={error} />}
      <SkillCategoryLink id={id} name={name} />
      {numSkillsString}
    </>
  );
};

export default SkillCategoryLinkWithNumSkills;
