import { Link } from "@tanstack/react-router";
import { type Job } from "../hooks/useJobs";
import { type Skill } from "../hooks/useSkills";

const JobSkills = ({
  job,
  skills
}: {
  job: Job;
  skills: Array<Skill> | undefined;
}) => {
  if (!job || !skills) {
    return null;
  }

  return (
    <ul className="list-inside list-disc">
      {job.skills.map((skill) => (
        <li key={skill.id}>
          <Link to="/skills/$id" params={{ id: skill.id.toString() }}>
            {skill.name}
          </Link>
        </li>
      ))}
      {job.skillVersions.map((skillVersion) => (
        <li key={skillVersion.id}>
          <Link
            to="/skills/$id/skill_versions/$skill_version_id"
            params={{
              id: skillVersion.skill_id.toString(),
              skill_version_id: skillVersion.id.toString()
            }}
          >
            {skills.find((skill) => skill.id === skillVersion.skill_id)?.name}{" "}
            {skillVersion.version}
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default JobSkills;
