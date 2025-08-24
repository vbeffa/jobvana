import type { SkillVersion } from "../hooks/useSkills";
import useSkills from "../hooks/useSkills";
import SkillVersionLink from "./SkillVersionLink";

const SkillVersionsList = ({
  skillVersions
}: {
  skillVersions: Array<SkillVersion>;
}) => {
  const { findSkill } = useSkills();
  return (
    <ul className="list-inside list-disc">
      {skillVersions.map((skillVersion) => {
        const skill = findSkill(skillVersion.skill_id);

        return (
          skill && (
            <li key={skillVersion.id}>
              <SkillVersionLink skill={skill} skillVersion={skillVersion} />
            </li>
          )
        );
      })}
    </ul>
  );
};

export default SkillVersionsList;
