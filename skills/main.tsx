import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "../src/index.css";
import Skills from "./Skills.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Skills />
  </StrictMode>
);
