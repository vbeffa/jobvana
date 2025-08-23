import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "../src/index.css";
import Jobs from "../src/jobs/Jobs.tsx";
import Job from "../src/jobs/Job.tsx";

const location = window.location.toString();
if (location.includes("?id=")) {
  const jobId = location.substring(location.indexOf("?id=") + 4);
  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <Job id={parseInt(jobId)} />
    </StrictMode>
  );
} else {
  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <Jobs />
    </StrictMode>
  );
}
