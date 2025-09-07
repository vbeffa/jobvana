import PillContainer from '../PillContainer';
import SkillCategoryLink, {
  type SkillCategoryLinkProps
} from './SkillCategoryLink';

export type SkillCategoriesListProps = {
  skillCategories: Array<SkillCategoryLinkProps>;
};

const SkillCategoriesList = ({ skillCategories }: SkillCategoriesListProps) => {
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
