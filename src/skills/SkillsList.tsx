import type { Skill } from '../hooks/useSkills';
import SkillLink from './SkillLink';

const SkillsList = ({ skills }: { skills: Array<Skill> }) => {
  return (
    <ul>
      {skills.map((skill) => (
        <li key={skill.id}>
          <SkillLink skill={skill} includeAbbrev={true} />
        </li>
      ))}
    </ul>
  );
};

export default SkillsList;
