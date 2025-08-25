import useSkills from "../hooks/useSkills";
import { Route } from "../routes/jobvana.skill_categories.$id";
import SkillsList from "./SkillsList";
import SkillCategoryLink from "./SkillCategoryLink";
import SkillCategoriesList from "./SkillCategoriesList";

const SkillCategory = () => {
  const { skillCategoryId } = Route.useLoaderData();
  const {
    findSkillCategory: findSkillCategory,
    findSkills,
    findChildSkillCategories: findChildSkillCategories
  } = useSkills();
  const skillCategory = findSkillCategory(skillCategoryId);
  if (!skillCategory) {
    return null;
  }
  const parentSkillCategory =
    skillCategory.parent_skill_category_id &&
    findSkillCategory(skillCategory.parent_skill_category_id);
  const skills = findSkills(skillCategoryId);
  const childSkillCategories = findChildSkillCategories(skillCategory.id);

  return (
    <>
      <h1>{skillCategory.name}</h1>
      <h2>Description</h2>
      <div className="card text-left whitespace-pre-wrap">
        {skillCategory.description}
      </div>
      <h2>Parent Category</h2>
      <div className="card text-left">
        {parentSkillCategory && (
          <SkillCategoryLink skillCategory={parentSkillCategory} />
        )}
        {!parentSkillCategory && <>---</>}
      </div>
      <h2>Subcategories</h2>
      <div className="card text-left">
        {childSkillCategories && (
          <SkillCategoriesList skillCategories={childSkillCategories} />
        )}
        {childSkillCategories?.length === 0 && <>---</>}
      </div>
      <h2>Skills</h2>
      <div className="card text-left">
        {skills && <SkillsList skills={skills} />}
      </div>
      <h2>Notes</h2>
      <div className="card text-left whitespace-pre-wrap">
        {skillCategory.notes}
      </div>
      <h2>Reference</h2>
      <div className="card text-left">
        {skillCategory.reference && (
          <a target="_blank" href={skillCategory.reference}>
            {skillCategory.reference}
          </a>
        )}
      </div>
    </>
  );
};

export default SkillCategory;
