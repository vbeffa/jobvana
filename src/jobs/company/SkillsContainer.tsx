import _ from 'lodash';
import PillContainer from '../../containers/PillContainer';
import type { Skill } from '../../types';

const SkillsContainer = ({
  skills,
  selectedSkillIds,
  onChange
}: {
  skills: Array<Skill>;
  selectedSkillIds: Array<number>;
  onChange: (skillIds: Array<number>) => void;
}) => {
  return (
    <div className="h-22.5 border-[0.5px] border-gray-500">
      <div className="w-full h-fit max-h-21.5 overflow-auto p-1 flex flex-row flex-wrap gap-1">
        {skills.map((skill, idx) => (
          <div key={idx}>
            <PillContainer
              type="check"
              checked={selectedSkillIds.includes(skill.id)}
              onAdd={() => {
                const updatedSkillIds = _.cloneDeep(selectedSkillIds);
                updatedSkillIds.push(skill.id);
                onChange(updatedSkillIds);
              }}
              onDelete={() => {
                const updatedSkillIds = _.cloneDeep(selectedSkillIds);
                const idx = updatedSkillIds.findIndex((id) => id === skill.id);
                updatedSkillIds.splice(idx, 1);
                onChange(updatedSkillIds);
              }}
            >
              {skill.abbreviation ?? skill.name}
            </PillContainer>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SkillsContainer;
