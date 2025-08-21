import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "../src/index.css";
import Jobs from "./Jobs.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Jobs />
  </StrictMode>
);
