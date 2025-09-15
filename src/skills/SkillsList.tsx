import PillContainer from '../PillContainer';
import { type SkillLinkProps } from './SkillLink';

export type SkillsListProps = {
  skills: Array<SkillLinkProps['skill']>;
};

const SkillsList = ({ skills }: SkillsListProps) => {
  return (
    <div className="pt-2 flex flex-wrap gap-2">
      {skills.map((skill) => (
        <div key={skill.id}>
          <PillContainer>
            <>{skill.name}</>
          </PillContainer>
        </div>
      ))}
    </div>
  );
};

export default SkillsList;
