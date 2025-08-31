import { type Job } from '../hooks/useJobs';
import SkillLink from '../skills/SkillLink';

const JobSkills = ({ job }: { job: Job }) => {
  return (
    <ul>
      {job.skills.map((skill) => (
        <li key={skill.id}>
          <SkillLink skill={skill} />
        </li>
      ))}
      {/* {job.skillVersions.map((skillVersion) => {
        const skill = findSkill(skillVersion.skill_id);
        return (
          <li key={skillVersion.id}>
            {skill && (
              <SkillVersionLink skill={skill} skillVersion={skillVersion} />
            )}
          </li>
        );
      })} */}
    </ul>
  );
};

export default JobSkills;
