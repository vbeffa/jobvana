import { type Job } from "../hooks/useJobs";
import useSkills from "../hooks/useSkills";
import SkillLink from "../skills/SkillLink";
import SkillVersionLink from "../skills/SkillVersionLink";

const JobSkills = ({ job }: { job: Job }) => {
  const { findSkill } = useSkills();

  return (
    <ul className="list-inside list-disc">
      {job.skills.map((skill) => (
        <li key={skill.id}>
          <SkillLink skill={skill} />
        </li>
      ))}
      {job.skillVersions.map((skillVersion) => {
        const skill = findSkill(skillVersion.skill_id);
        return (
          <li key={skillVersion.id}>
            {skill && (
              <SkillVersionLink skill={skill} skillVersion={skillVersion} />
            )}
            ;
          </li>
        );
      })}
    </ul>
  );
};

export default JobSkills;
