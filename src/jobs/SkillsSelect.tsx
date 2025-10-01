import { useMemo, useState } from 'react';
import TextInput from '../inputs/TextInput';
import useSkillsLite from '../skills/useSkillsLite';
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
  const { skills } = useSkillsLite();

  const filteredSkills = useMemo(
    () =>
      skills
        ?.filter(
          (skill) =>
            skill.name
              .toLocaleLowerCase()
              .includes(filter.toLocaleLowerCase()) ||
            skill.abbreviation
              ?.toLocaleLowerCase()
              .includes(filter.toLocaleLowerCase())
        )
        .sort((skill1, skill2) =>
          (skill1.abbreviation ?? skill1.name).localeCompare(
            skill2.abbreviation ?? skill2.name
          )
        ),
    [filter, skills]
  );

  if (!filteredSkills) {
    return null;
  }

  return (
    <>
      <div className={`${width} h-fit`}>
        <TextInput
          id="skills_filter"
          height="h-6"
          placeholder="Search for skill"
          onChange={setFilter}
        />
        <SkillsContainer
          skills={filteredSkills}
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
