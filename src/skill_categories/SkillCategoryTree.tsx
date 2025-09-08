import type { SkillCategory } from '../hooks/useSkillCategories';
import SkillCategoryLinkWithNumSkills from './SkillCategoryLinkWithNumSkills';

const SkillCategoryTree = ({
  skillCategories,

  open
}: {
  skillCategories: Array<SkillCategory>;

  open: boolean;
}) => {
  return (
    <ul className="tree">
      {skillCategories
        .sort((c1, c2) => c1.name.localeCompare(c2.name))
        .map((skillCategory) => {
          return (
            <li key={skillCategory.id}>
              {skillCategory.childCategories.length > 0 && (
                <details open={open}>
                  <summary className="pb-[2px]">
                    <SkillCategoryLinkWithNumSkills {...skillCategory} />
                  </summary>
                  <SkillCategoryTree
                    skillCategories={skillCategory.childCategories}
                    open={open}
                  />
                </details>
              )}
              {skillCategory.childCategories.length === 0 && (
                <div className="pb-[2px]">
                  <span className="font-extrabold">&bull;</span>{' '}
                  <SkillCategoryLinkWithNumSkills {...skillCategory} />
                </div>
              )}
            </li>
          );
        })}
    </ul>
  );
};

export default SkillCategoryTree;
