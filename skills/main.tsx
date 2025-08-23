import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "../src/index.css";
import Skill from "../src/skills/Skill.tsx";
import Skills from "../src/skills/Skills.tsx";
import SkillVersion from "../src/skills/SkillVersion.tsx";

const location = window.location.toString();
if (location.includes("?id=")) {
  const skillId = location.substring(location.indexOf("?id=") + 4);
  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <Skill id={parseInt(skillId)} />
    </StrictMode>
  );
} else if (location.includes("version_id")) {
  const versionId = location.substring(location.indexOf("?version_id=") + 12);
  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <SkillVersion versionId={parseInt(versionId)} />
    </StrictMode>
  );
} else {
  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <Skills />
    </StrictMode>
  );
}
