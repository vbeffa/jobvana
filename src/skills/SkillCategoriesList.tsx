import type { SkillCategory } from '../hooks/useSkills';
import PillContainer from '../PillContainer';
import SkillCategoryLink from './SkillCategoryLink';

const SkillCategoriesList = ({
  skillCategories
}: {
  skillCategories: Array<SkillCategory>;
}) => {
  return (
    <div className="flex flex-wrap gap-2">
      {skillCategories
        .sort((c1, c2) => c1.name.localeCompare(c2.name))
        .map((skillCategory) => (
          <div key={skillCategory.id}>
            <PillContainer>
              <SkillCategoryLink {...skillCategory} />
            </PillContainer>
          </div>
        ))}
    </div>
  );
};

export default SkillCategoriesList;
