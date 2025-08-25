import useSkills from "../hooks/useSkills";
import { Route } from "../routes/jobvana.skill_categories.$skill_category_id";
import SkillsList from "./SkillsList";
import SkillCategoryLink from "./SkillCategoryLink";
import SkillCategoriesList from "./SkillCategoriesList";

const SkillCategory = () => {
  const { skillCategoryId } = Route.useLoaderData();
  const { findSkillType, findSkills, findChildSkillTypes } = useSkills();
  const skillType = findSkillType(skillCategoryId);
  if (!skillType) {
    return null;
  }
  const parentSkillType =
    skillType.parent_skill_category_id &&
    findSkillType(skillType.parent_skill_category_id);
  const skills = findSkills(skillCategoryId);
  const childSkillTypes = findChildSkillTypes(skillType.id);

  return (
    <>
      <h1>{skillType.name}</h1>
      <h2>Description</h2>
      <div className="card text-left whitespace-pre-wrap">
        {skillType.description}
      </div>
      <h2>Parent Category</h2>
      <div className="card text-left">
        {parentSkillType && <SkillCategoryLink skillType={parentSkillType} />}
        {!parentSkillType && <>---</>}
      </div>
      <h2>Subcategories</h2>
      <div className="card text-left">
        {childSkillTypes && (
          <SkillCategoriesList skillTypes={childSkillTypes} />
        )}
        {childSkillTypes?.length === 0 && <>---</>}
      </div>
      <h2>Skills</h2>
      <div className="card text-left">
        {skills && <SkillsList skills={skills} />}
      </div>
      <h2>Notes</h2>
      <div className="card text-left whitespace-pre-wrap">
        {skillType.notes}
      </div>
      <h2>Reference</h2>
      <div className="card text-left">
        {skillType.reference && (
          <a target="_blank" href={skillType.reference}>
            {skillType.reference}
          </a>
        )}
      </div>
    </>
  );
};

export default SkillCategory;
