import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "../src/index.css";
import Skill from "./Skill.tsx";
import Skills from "./Skills.tsx";

const location = window.location.toString();
if (location.includes("?id=")) {
  const skillId = location.substring(location.indexOf("?id=") + 4);
  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <Skill id={parseInt(skillId)} />
    </StrictMode>
  );
} else {
  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <Skills />
    </StrictMode>
  );
}
