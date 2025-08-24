import type { SkillType } from "../hooks/useSkills";
import SkillTypeLink from "./SkillTypeLink";

const SkillTypesList = ({ skillTypes }: { skillTypes: Array<SkillType> }) => {
  return (
    <ul className="list-inside list-disc">
      {skillTypes.map((skillType) => (
        <li key={skillType.id}>
          <SkillTypeLink skillType={skillType} />
        </li>
      ))}
    </ul>
  );
};

export default SkillTypesList;
