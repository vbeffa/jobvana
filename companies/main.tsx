import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "../src/index.css";
import Companies from "./Companies.tsx";
import Company from "./Company.tsx";

const location = window.location.toString();
if (location.includes("?id=")) {
  const companyId = location.substring(location.indexOf("?id=") + 4);
  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <Company id={parseInt(companyId)} />
    </StrictMode>
  );
} else {
  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <Companies />
    </StrictMode>
  );
}
