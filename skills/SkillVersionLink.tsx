import "../src/App.css";
import type { SkillVersion } from "../src/hooks/useSkills";

function SkillVersionLink({ skillVersion }: { skillVersion: SkillVersion }) {
  return (
    <a href={`/jobvana/skills/?version_id=${skillVersion.id}`}>
      {skillVersion.version}
    </a>
  );
}

export default SkillVersionLink;
