import { useMemo, useState } from 'react';
import TextInput from '../inputs/TextInput';
import useSkillsLite from '../skills/useSkillsLite';
import { skillSorter } from '../skills/utils';
import SkillsContainer from './company/SkillsContainer';

const SkillsSelect = ({
  selectedSkillIds,
  width = 'w-full',
  outerHeight,
  innerHeight,
  onChange
}: {
  selectedSkillIds: Array<number>;
  width?: string;
  outerHeight?: string;
  innerHeight?: string;
  onChange: (skillIds: Array<number>) => void;
}) => {
  const [filter, setFilter] = useState('');
  const { skills, isPending, findSkill } = useSkillsLite();

  const filteredSkills = useMemo(
    () =>
      selectedSkillIds
        .map((skillId) => {
          const skill = findSkill(skillId);
          return skill;
        })
        .filter((skill) => skill !== undefined)
        .sort(skillSorter)
        .concat(
          (skills ?? [])
            .filter(
              (skill) =>
                !selectedSkillIds.includes(skill.id) &&
                (skill.name
                  .toLocaleLowerCase()
                  .includes(filter.toLocaleLowerCase()) ||
                  skill.abbreviation
                    ?.toLocaleLowerCase()
                    .includes(filter.toLocaleLowerCase()))
            )
            .sort(skillSorter)
        ),
    [filter, findSkill, selectedSkillIds, skills]
  );

  return (
    <>
      <div className={`${width} h-fit`}>
        <TextInput
          id="skills_filter"
          value={filter}
          size="sm"
          width="w-full max-w-84"
          placeholder="Search for skill"
          onChange={setFilter}
          showClear={true}
          onClear={() => setFilter('')}
        />
        <SkillsContainer
          skills={filteredSkills}
          isLoading={isPending}
          selectedSkillIds={selectedSkillIds}
          outerHeight={outerHeight}
          innerHeight={innerHeight}
          onChange={onChange}
        />
      </div>
    </>
  );
};

export default SkillsSelect;
