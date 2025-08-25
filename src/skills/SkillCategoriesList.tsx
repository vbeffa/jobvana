import type { SkillCategory } from "../hooks/useSkills";
import SkillCategoryLink from "./SkillCategoryLink";

const SkillCategoriesList = ({
  skillTypes
}: {
  skillTypes: Array<SkillCategory>;
}) => {
  return (
    <ul className="list-inside list-disc">
      {skillTypes.map((skillType) => (
        <li key={skillType.id}>
          <SkillCategoryLink skillType={skillType} />
        </li>
      ))}
    </ul>
  );
};

export default SkillCategoriesList;
