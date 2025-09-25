import _ from 'lodash';
import { useEffect, useState } from 'react';
import { FaFloppyDisk, FaX } from 'react-icons/fa6';
import PillContainer from '../../containers/PillContainer';
import useSkillsLite from '../../skills/useSkillsLite';
import type { Skill } from '../../types';

const MySkillsSelect = ({
  skillIds,
  onAddSkills,
  onCancel
}: {
  skillIds: Array<number>;
  onAddSkills: (skillIds: Array<number>) => void;
  onCancel: () => void;
}) => {
  const [newSkillIds, setNewSkillIds] = useState<Array<number>>([]);
  const [availableSkills, setAvailableSkills] = useState<Array<Skill>>([]);
  const { isPending, skills } = useSkillsLite();

  useEffect(() => {
    setAvailableSkills(
      (skills ?? []).filter((skill) => !skillIds.includes(skill.id))
    );
  }, [skillIds, skills]);

  return (
    <div
      id="my_skills_select"
      className="w-fit h-32 overflow-auto border-[0.5px] border-gray-500 p-1 flex flex-row flex-wrap gap-1"
    >
      {isPending && (
        <option key={0} value={Number.NEGATIVE_INFINITY}>
          Loading...
        </option>
      )}
      {availableSkills.map((skill, idx) => (
        <div
          key={idx}
          className="cursor-pointer"
          onClick={() => {
            setNewSkillIds((skillIds) => {
              const updated = _.cloneDeep(skillIds);
              updated.push(skill.id);
              return updated;
            });
            setAvailableSkills((skills) => {
              const updated = _.cloneDeep(skills);
              const index = updated.findIndex((s) => s.id === skill.id);
              if (index >= 0) {
                updated.splice(index, 1);
              }
              return updated;
            });
          }}
        >
          <PillContainer>{skill.abbreviation ?? skill.name}</PillContainer>
        </div>
      ))}
      <div
        className="absolute -bottom-5.5 text-blue-500 cursor-pointer"
        onClick={onCancel}
      >
        <FaX />
      </div>
      {newSkillIds.length > 0 && (
        <div
          className="absolute -bottom-5.5 left-48.5 text-blue-500 cursor-pointer"
          onClick={() => onAddSkills(newSkillIds)}
        >
          <FaFloppyDisk />
        </div>
      )}
    </div>
  );
};

export default MySkillsSelect;
