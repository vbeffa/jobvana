import { useMemo, useState } from 'react';
import TextInput from '../../inputs/TextInput';
import useSkillsLite from '../../skills/useSkillsLite';
import SkillsContainer from '../company/SkillsContainer';

const SkillSelect = ({
  skillIds,
  width = 'w-full',
  showAny = true,
  showEmpty = false,
  onChange
}: {
  skillIds: Array<number>;
  width?: string;
  showAny?: boolean;
  showEmpty?: boolean;
  onChange: (skillIds: Array<number>) => void;
}) => {
  if (showAny && showEmpty) {
    throw new Error('cannot set both showAny and showEmpty');
  }
  const [filter, setFilter] = useState('');
  const { skills } = useSkillsLite();
  // const [selectedSkillIds, setSelectedSkillIds] = useState<Array<number>>([]);

  const filteredSkills = useMemo(
    () =>
      skills?.filter(
        (skill) =>
          skill.name.toLocaleLowerCase().includes(filter.toLocaleLowerCase()) ||
          skill.abbreviation
            ?.toLocaleLowerCase()
            .includes(filter.toLocaleLowerCase())
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
          id="skill_filter"
          height="h-6"
          placeholder="Search for skill"
          onChange={setFilter}
        />
        <SkillsContainer
          skills={filteredSkills}
          selectedSkillIds={skillIds}
          onChange={onChange}
        />
      </div>
      {/* <Select
        id={id}
        value={skillIds?.[0]}
        width={width}
        onChange={(e) => onChange(parseInt(e.target.value))}
      >
        <>
          {isPending && (
            <option key={0} value={Number.NEGATIVE_INFINITY}>
              Loading...
            </option>
          )}
          {!isPending && showAny && (
            <option key={0} value={0}>
              Any
            </option>
          )}
          {showEmpty && <option key={0} value="" />}
          {skills?.map((skill, idx) => (
            <option key={idx} value={skill.id}>
              {skill.name}
              {skill.abbreviation && ` (${skill.abbreviation})`}
            </option>
          ))}
        </>
      </Select> */}
    </>
  );
};

export default SkillSelect;
