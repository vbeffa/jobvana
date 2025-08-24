import { Link } from "@tanstack/react-router";
import type { Skill } from "../hooks/useSkills";

const SkillLink = ({ skill }: { skill: Skill }) => {
  return (
    <Link to="/jobvana/skills/$id" params={{ id: skill.id.toString() }}>
      {skill.name}
    </Link>
  );
};

export default SkillLink;
