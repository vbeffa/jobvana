import type { Skill } from "../hooks/useSkills";
import SkillLink from "./SkillLink";

const SkillsList = ({ skills }: { skills: Array<Skill> }) => {
  return (
    <ul className="list-inside list-disc">
      {skills.map((skill) => (
        <li key={skill.id}>
          <SkillLink skill={skill} />
        </li>
      ))}
    </ul>
  );
};

export default SkillsList;
