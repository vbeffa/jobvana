import SkillLink from "../skills/SkillLink";
import SkillVersionLink from "../skills/SkillVersionLink";
import { type Job } from "../hooks/useJobs";
import { type SkillsHook } from "../hooks/useSkills";

const JobSkills = ({
  job,
  skills,
  gotoSkill,
  gotoSkillVersion
}: {
  job: Job;
  skills: SkillsHook;
  gotoSkill: (skillId: number) => void;
  gotoSkillVersion: (skillVersionId: number) => void;
}) => {
  if (!job || !skills) {
    return null;
  }

  return (
    <ul className="list-inside list-disc">
      {job.skills.map((skill) => (
        <li key={skill.id}>
          <SkillLink skill={skill} gotoSkill={gotoSkill} />
        </li>
      ))}
      {job.skillVersions.map((skillVersion) => (
        <li key={skillVersion.id}>
          <SkillVersionLink
            skillVersion={skillVersion}
            gotoSkillVersion={gotoSkillVersion}
          />
        </li>
      ))}
    </ul>
  );
};

export default JobSkills;
