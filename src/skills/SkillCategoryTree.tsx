import type { Skill, SkillCategory } from '../hooks/useSkills';
import SkillCategoryLink from './SkillCategoryLink';

const SkillCategoryTree = ({
  skillCategories,
  skills,
  open
}: {
  skillCategories: Array<SkillCategory>;
  skills: Array<Skill>;
  open: boolean;
}) => {
  return (
    <ul className="tree">
      {skillCategories
        .sort((c1, c2) => c1.name.localeCompare(c2.name))
        .map((skillCategory) => {
          const numSkills = skills.filter(
            (skill) => skill.skill_category_id === skillCategory.id
          ).length;
          const numSkillsString = numSkills
            ? ` (${numSkills} skill${numSkills > 1 ? 's' : ''})`
            : null;
          return (
            <li key={skillCategory.id}>
              {skillCategory.childCategories.length > 0 && (
                <details open={open}>
                  <summary className="pb-[2px]">
                    <SkillCategoryLink skillCategory={skillCategory} />
                    {numSkillsString}
                  </summary>
                  <SkillCategoryTree
                    skillCategories={skillCategory.childCategories}
                    skills={skills}
                    open={open}
                  />
                </details>
              )}
              {skillCategory.childCategories.length === 0 && (
                <div className="pb-[2px]">
                  <span className="font-extrabold">&bull;</span>{' '}
                  <SkillCategoryLink skillCategory={skillCategory} />
                  {numSkillsString}
                </div>
              )}
            </li>
          );
        })}
    </ul>
  );
};

export default SkillCategoryTree;
