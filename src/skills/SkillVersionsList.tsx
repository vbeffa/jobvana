import type { Skill, SkillVersion } from '../hooks/types';
import SkillVersionLink from './SkillVersionLink';

export type SkillVersionsListProps = {
  skillVersions: Array<
    Pick<SkillVersion, 'id' | 'ordinal' | 'skill_id' | 'version'>
  >;
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
