import SkillLink, { type SkillLinkProps } from './SkillLink';

export type SkillsListProps = {
  skills: Array<SkillLinkProps['skill']>;
};

const SkillsList = ({ skills }: SkillsListProps) => {
  return (
    <div className="flex flex-wrap gap-2">
      {skills.map((skill) => (
        <div key={skill.id}>
          <SkillLink skill={skill} includeAbbrev={true} />
        </div>
      ))}
    </div>
  );
};

export default SkillsList;
