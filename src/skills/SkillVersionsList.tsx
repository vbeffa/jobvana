import SkillVersionLink from './SkillVersionLink';
import type { Skill, SkillVersion } from './useSkill';

export type SkillVersionsListProps = {
  skillVersions: Array<SkillVersion>;
  skill: Pick<Skill, 'skill_category_id' | 'name'>;
};

const SkillVersionsList = ({
  skillVersions,
  skill
}: SkillVersionsListProps) => {
  return (
    <ul>
      {skillVersions
        .sort(
          (skillVersion1, skillVersion2) =>
            skillVersion2.ordinal - skillVersion1.ordinal
        )
        .map((skillVersion) => {
          return (
            <li key={skillVersion.id}>
              <SkillVersionLink {...skill} {...skillVersion} />
            </li>
          );
        })}
    </ul>
  );
};

export default SkillVersionsList;
