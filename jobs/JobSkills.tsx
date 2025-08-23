import SkillLink from "../skills/SkillLink";
import SkillVersionLink from "../skills/SkillVersionLink";
import "../src/App.css";
import { Job } from "../src/hooks/useJobs";
import { SkillsHook } from "../src/hooks/useSkills";

const JobSkills = ({ job, skills }: { job: Job; skills: SkillsHook }) => {
  if (!job || !skills) {
    return null;
  }

  return (
    <ul className="list-inside list-disc">
      {job.skills.map((skill) => (
        <li key={skill.id}>
          <SkillLink skill={skill} />
        </li>
      ))}
      {job.skillVersions.map((skillVersion) => (
        <li key={skillVersion.id}>
          <SkillVersionLink
            skill={skills.skill(skillVersion.skill_id)!}
            skillVersion={skillVersion}
          />
        </li>
      ))}
    </ul>
  );
};

export default JobSkills;
