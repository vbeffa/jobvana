import { useEffect, useState } from 'react';
import { FaArrowRightArrowLeft } from 'react-icons/fa6';
import PillContainer from '../../containers/PillContainer';
import useSkillsLite from '../../skills/useSkillsLite';
import type { Skill } from '../../types';

const MySkillsSelect = ({
  skillIds,
  onAddSkill,
  onDeleteSkill
}: {
  skillIds: Array<number>;
  onAddSkill: (skillId: number) => void;
  onDeleteSkill: (skillId: number) => void;
}) => {
  // const [newSkillIds, setNewSkillIds] = useState<Array<number>>([]);
  const [currentSkills, setCurrentSkills] = useState<Array<Skill>>([]);
  const [availableSkills, setAvailableSkills] = useState<Array<Skill>>([]);
  const { skills } = useSkillsLite();

  useEffect(() => {
    setAvailableSkills(
      (skills ?? [])
        .filter((skill) => !skillIds.includes(skill.id))
        .sort((skill1, skill2) =>
          (skill1.abbreviation ?? skill1.name).localeCompare(
            skill2.abbreviation ?? skill2.name
          )
        )
    );
  }, [skillIds, skills]);

  useEffect(() => {
    setCurrentSkills(
      (skills ?? [])
        .filter((skill) => skillIds.includes(skill.id))
        .sort((skill1, skill2) =>
          (skill1.abbreviation ?? skill1.name).localeCompare(
            skill2.abbreviation ?? skill2.name
          )
        )
    );
  }, [skillIds, skills]);

  return (
    <div className="flex flex-row gap-2">
      <div className="w-[50%]">
        <div className="text-sm">Current Skills</div>
        <div className="h-64 border-[0.5px] border-gray-500">
          <div
            id="my_skills_select"
            className="w-full h-fit max-h-63 overflow-auto p-1 flex flex-row flex-wrap gap-1"
          >
            {currentSkills.map((skill, idx) => (
              <div key={idx}>
                <PillContainer
                  showDeleteIcon={true}
                  onDelete={() => onDeleteSkill(skill.id)}
                >
                  {skill.abbreviation ?? skill.name}
                </PillContainer>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div
        className="content-center text-blue-300 cursor-pointer"
        onClick={() =>
          alert(
            'Click the plus icon to add skills or the trash icon to remove skills.'
          )
        }
      >
        <FaArrowRightArrowLeft />
      </div>
      <div className="w-[50%]">
        <div className="text-sm">Available Skills</div>
        <div className="h-64 border-[0.5px] border-gray-500">
          <div
            id="my_skills_select"
            className="w-full h-fit max-h-63 overflow-auto p-1 flex flex-row flex-wrap gap-1"
          >
            {availableSkills.map((skill, idx) => (
              <div key={idx} className="">
                <PillContainer
                  showAddIcon={true}
                  onAdd={() => onAddSkill(skill.id)}
                >
                  {skill.abbreviation ?? skill.name}
                </PillContainer>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MySkillsSelect;
