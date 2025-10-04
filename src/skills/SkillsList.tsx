import PillContainer from '../containers/PillContainer';
import SkillLink, { type SkillLinkProps } from './SkillLink';

export type SkillsListProps = {
  skills: Array<SkillLinkProps['skill']>;
  pt?: string;
};

const SkillsList = ({ skills, pt = 'pt-2' }: SkillsListProps) => {
  return (
    <div className={`${pt} flex flex-wrap gap-2`}>
      {skills.map((skill) => (
        <div key={skill.id}>
          <PillContainer>
            <SkillLink skill={skill} />
          </PillContainer>
        </div>
      ))}
    </div>
  );
};

export default SkillsList;
