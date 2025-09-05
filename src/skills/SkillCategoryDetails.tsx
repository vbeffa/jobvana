import useSkills from '../hooks/useSkills';
import SkillCategoriesList from './SkillCategoriesList';
import SkillCategoryLink from './SkillCategoryLink';
import SkillsList from './SkillsList';

const SkillCategoryDetails = ({ id }: { id: number }) => {
  const {
    findSkillCategory: findSkillCategory,
    findSkills,
    findChildSkillCategories
  } = useSkills();
  const skillCategory = findSkillCategory(id);
  if (!skillCategory) {
    return null;
  }
  const parentSkillCategory =
    skillCategory.parent_skill_category_id &&
    findSkillCategory(skillCategory.parent_skill_category_id);
  const skills = findSkills(id);
  const childSkillCategories = findChildSkillCategories(skillCategory.id);

  return (
    <div className="mx-4 flex flex-col gap-2">
      <h1>{skillCategory.name}</h1>
      <h2>Description</h2>
      <div className="whitespace-pre-wrap">{skillCategory.description}</div>
      <h2>Parent Category</h2>
      <div>
        {parentSkillCategory && (
          <SkillCategoryLink skillCategory={parentSkillCategory} />
        )}
        {!parentSkillCategory && <>---</>}
      </div>
      <h2>Subcategories</h2>
      <div>
        {childSkillCategories && (
          <SkillCategoriesList skillCategories={childSkillCategories} />
        )}
        {childSkillCategories?.length === 0 && <>---</>}
      </div>
      <h2>Skills</h2>
      <div>{skills && <SkillsList skills={skills} />}</div>
      <h2>Notes</h2>
      <div className="whitespace-pre-wrap">{skillCategory.notes}</div>
      <h2>Reference</h2>
      <div>
        {skillCategory.reference && (
          <a target="_blank" href={skillCategory.reference}>
            {skillCategory.reference}
          </a>
        )}
      </div>
    </div>
  );
};

export default SkillCategoryDetails;
