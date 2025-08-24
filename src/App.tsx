import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import "./App.css";
import Companies from "./companies/Companies.tsx";
import Company from "./companies/Company.tsx";
import Header from "./Header";
import Job from "./jobs/Job.tsx";
import Jobs from "./jobs/Jobs.tsx";
import Skill from "./skills/Skill.tsx";
import Skills from "./skills/Skills.tsx";
import SkillVersion from "./skills/SkillVersion.tsx";

export type CurrentPage =
  | "jobs"
  | "job"
  | "skills"
  | "skill"
  | "skill_version"
  | "companies"
  | "company";

export type AppState = {
  currPage: CurrentPage;
  id?: number;
};

const queryClient = new QueryClient();

const App = () => {
  const [appState, setAppState] = useState<AppState>({ currPage: "jobs" });

  const gotoPage = (page: CurrentPage) => {
    setAppState({
      currPage: page
    });
  };

  const gotoCompany = (companyId: number) => {
    setAppState({
      currPage: "company",
      id: companyId
    });
  };

  const gotoJob = (jobId: number) => {
    setAppState({
      currPage: "job",
      id: jobId
    });
  };

  const gotoSkill = (skillId: number) => {
    setAppState({
      currPage: "skill",
      id: skillId
    });
  };

  const gotoSkillVersion = (skillVersionId: number) => {
    setAppState({
      currPage: "skill_version",
      id: skillVersionId
    });
  };

  return (
    <QueryClientProvider client={queryClient}>
      <Header appState={appState} setCurrPage={gotoPage} />
      {appState.currPage === "jobs" && (
        <Jobs
          gotoCompany={gotoCompany}
          gotoJob={gotoJob}
          gotoSkill={gotoSkill}
          gotoSkillVersion={gotoSkillVersion}
        />
      )}
      {appState.currPage === "skills" && <Skills gotoSkill={gotoSkill} />}
      {appState.currPage === "companies" && (
        <Companies gotoCompany={gotoCompany} />
      )}
      {appState.currPage === "company" && appState.id && (
        <Company id={appState.id} gotoJob={gotoJob} />
      )}
      {appState.currPage === "job" && appState.id && (
        <Job
          id={appState.id}
          gotoSkill={gotoSkill}
          gotoSkillVersion={gotoSkillVersion}
        />
      )}
      {appState.currPage === "skill" && appState.id && (
        <Skill
          id={appState.id}
          gotoSkill={gotoSkill}
          gotoSkillVersion={gotoSkillVersion}
        />
      )}
      {appState.currPage === "skill_version" && appState.id && (
        <SkillVersion versionId={appState.id} />
      )}
    </QueryClientProvider>
  );
};

export default App;
