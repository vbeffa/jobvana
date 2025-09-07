import type { SkillVersion } from '../hooks/types';
import useSkills from '../hooks/useSkills';
import SkillVersionLink from './SkillVersionLink';

const SkillVersionsList = ({
  skillVersions
}: {
  skillVersions: Array<SkillVersion>;
}) => {
  const { findSkill } = useSkills();
  return (
    <ul>
      {skillVersions
        .sort(
          (skillVersion1, skillVersion2) =>
            skillVersion2.ordinal - skillVersion1.ordinal
        )
        .map((skillVersion) => {
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
