import _ from 'lodash';
import PillContainer from '../../containers/PillContainer';
import type { Skill } from '../../types';

const SkillsContainer = ({
  skills,
  isLoading,
  selectedSkillIds,
  outerHeight,
  innerHeight,
  onChange
}: {
  skills: Array<Skill>;
  isLoading: boolean;
  selectedSkillIds: Array<number>;
  outerHeight?: string;
  innerHeight?: string;
  onChange: (skillIds: Array<number>) => void;
}) => {
  return (
    <div className={`${outerHeight} border-[0.5px] border-gray-500`}>
      {!isLoading && (
        <div
          className={`w-full h-fit ${innerHeight} p-1 flex flex-row flex-wrap gap-1`}
        >
          {skills.map((skill, idx) => (
            <div key={idx}>
              <PillContainer
                type="check"
                checked={selectedSkillIds.includes(skill.id)}
                tooltipMessage={skill.abbreviation ? skill.name : undefined}
                onAdd={() => {
                  const updatedSkillIds = _.cloneDeep(selectedSkillIds);
                  updatedSkillIds.push(skill.id);
                  onChange(updatedSkillIds);
                }}
                onDelete={() => {
                  const updatedSkillIds = _.cloneDeep(selectedSkillIds);
                  const idx = updatedSkillIds.findIndex(
                    (id) => id === skill.id
                  );
                  updatedSkillIds.splice(idx, 1);
                  onChange(updatedSkillIds);
                }}
              >
                {skill.abbreviation ?? skill.name}
              </PillContainer>
            </div>
          ))}
        </div>
      )}
      {isLoading && (
        <div className={`flex justify-center h-full mt-2`}>Loading...</div>
      )}
    </div>
  );
};

export default SkillsContainer;
