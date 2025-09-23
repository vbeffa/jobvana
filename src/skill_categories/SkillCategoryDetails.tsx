import PillContainer from '../containers/PillContainer';
import Section from '../Section';
import SkillsList from '../skills/SkillsList';
import SkillCategoriesList from './SkillCategoriesList';
import SkillCategoryLink from './SkillCategoryLink';
import useSkillCategories from './useSkillCategories';
import useSkillsForCategory from './useSkillsForCategory';

const SkillCategoryDetails = ({ id }: { id: number }) => {
  const { skills } = useSkillsForCategory(id); // TODO this is paged and only returns the first 10
  const { findSkillCategory, findChildSkillCategories } = useSkillCategories();
  const skillCategory = findSkillCategory(id);
  if (!skillCategory) {
    return null;
  }
  const parentSkillCategory =
    skillCategory.parent_skill_category_id &&
    findSkillCategory(skillCategory.parent_skill_category_id);
  const childSkillCategories = findChildSkillCategories(skillCategory);

  return (
    <>
      <Section title={skillCategory.name}>{skillCategory.description}</Section>
      <Section title="Parent Category">
        <div className="mt-2">
          {parentSkillCategory ? (
            <PillContainer>
              <SkillCategoryLink {...parentSkillCategory} />
            </PillContainer>
          ) : (
            <>---</>
          )}
        </div>
      </Section>
      <Section title="Subcategories">
        <div className="mt-2">
          {childSkillCategories ? (
            <SkillCategoriesList skillCategories={childSkillCategories} />
          ) : (
            <>---</>
          )}
        </div>
      </Section>
      <Section title="Skills">
        {skills ? <SkillsList skills={skills} /> : null}
      </Section>
      <Section title="Notes">{skillCategory.notes}</Section>
      <Section title="Reference" isLast={true}>
        {skillCategory.reference && (
          <a target="_blank" href={skillCategory.reference}>
            {skillCategory.reference}
          </a>
        )}
      </Section>
    </>
  );
};

export default SkillCategoryDetails;
