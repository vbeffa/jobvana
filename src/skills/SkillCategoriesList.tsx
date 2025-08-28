import type { SkillCategory } from '../hooks/useSkills';
import SkillCategoryLink from './SkillCategoryLink';

const SkillCategoriesList = ({
  skillCategories
}: {
  skillCategories: Array<SkillCategory>;
}) => {
  return (
    <ul className="list-inside list-disc">
      {skillCategories
        .sort((c1, c2) => c1.name.localeCompare(c2.name))
        .map((skillCategory) => (
          <li key={skillCategory.id}>
            <SkillCategoryLink skillCategory={skillCategory} />
          </li>
        ))}
    </ul>
  );
};

export default SkillCategoriesList;
