import useSkillCategories from '../hooks/useSkillCategories';
import useSkillsForCategory from '../hooks/useSkillsForCategory';
import PillContainer from '../PillContainer';
import SkillsList from '../skills/SkillsList';
import SkillCategoriesList from './SkillCategoriesList';
import SkillCategoryLink from './SkillCategoryLink';

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
    <div className="mx-4 flex flex-col gap-2">
      <h2>{skillCategory.name}</h2>
      <h2>Description</h2>
      <div className="whitespace-pre-wrap">{skillCategory.description}</div>
      <hr className="my-4 border-gray-400 shadow" />
      <h2>Parent Category</h2>
      <div>
        {parentSkillCategory && (
          <PillContainer>
            <SkillCategoryLink {...parentSkillCategory} />
          </PillContainer>
        )}
        {!parentSkillCategory && <>---</>}
      </div>
      <hr className="my-4 border-gray-400 shadow" />
      <h2>Subcategories</h2>
      <div>
        {childSkillCategories && (
          <SkillCategoriesList skillCategories={childSkillCategories} />
        )}
        {childSkillCategories?.length === 0 && <>---</>}
      </div>
      <hr className="my-4 border-gray-400 shadow" />
      <h2>Skills</h2>
      <div>{skills && <SkillsList skills={skills} />}</div>
      <hr className="my-4 border-gray-400 shadow" />
      <h2>Notes</h2>
      <div className="whitespace-pre-wrap">{skillCategory.notes}</div>
      <hr className="my-4 border-gray-400 shadow" />
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
