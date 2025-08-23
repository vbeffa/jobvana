import { useState } from "react";
import "./App.css";
import Companies from "./companies/Companies.tsx";
import Company from "./companies/Company.tsx";
import Header, { type CurrentPage } from "./Header";
import Job from "./jobs/Job.tsx";
import Jobs from "./jobs/Jobs.tsx";
import Skill from "./skills/Skill.tsx";
import Skills from "./skills/Skills.tsx";
import SkillVersion from "./skills/SkillVersion.tsx";

const App = () => {
  const [currPage, setCurrPage] = useState<CurrentPage>("jobs");
  const [companyId, setCompanyId] = useState<number>();
  const [jobId, setJobId] = useState<number>();
  const [skillId, setSkillId] = useState<number>();
  const [skillVersionId, setSkillVersionId] = useState<number>();

  const gotoPage = (page: CurrentPage) => {
    setCurrPage(page);
    setCompanyId(undefined);
    setJobId(undefined);
    setSkillId(undefined);
    setSkillVersionId(undefined);
  };

  const gotoCompany = (companyId: number) => {
    setCurrPage("company");
    setCompanyId(companyId);
    setJobId(undefined);
    setSkillId(undefined);
    setSkillVersionId(undefined);
  };

  const gotoJob = (jobId: number) => {
    setCurrPage("job");
    setJobId(jobId);
    setCompanyId(undefined);
    setSkillId(undefined);
    setSkillVersionId(undefined);
  };

  const gotoSkill = (skillId: number) => {
    setCurrPage("skill");
    setJobId(undefined);
    setCompanyId(undefined);
    setSkillId(skillId);
    setSkillVersionId(undefined);
  };

  const gotoSkillVersion = (skillVersionId: number) => {
    setCurrPage("skill_version");
    setJobId(undefined);
    setCompanyId(undefined);
    setSkillId(undefined);
    setSkillVersionId(skillVersionId);
  };

  return (
    <>
      <Header currPage={currPage} setCurrPage={gotoPage} />
      {currPage === "jobs" && (
        <Jobs
          gotoCompany={gotoCompany}
          gotoJob={gotoJob}
          gotoSkill={gotoSkill}
          gotoSkillVersion={gotoSkillVersion}
        />
      )}
      {currPage === "skills" && <Skills gotoSkill={gotoSkill} />}
      {currPage === "companies" && <Companies gotoCompany={gotoCompany} />}
      {companyId && <Company id={companyId} gotoJob={gotoJob} />}
      {jobId && (
        <Job
          id={jobId}
          gotoSkill={gotoSkill}
          gotoSkillVersion={gotoSkillVersion}
        />
      )}
      {skillId && (
        <Skill
          id={skillId}
          gotoSkill={gotoSkill}
          gotoSkillVersion={gotoSkillVersion}
        />
      )}
      {skillVersionId && <SkillVersion versionId={skillVersionId} />}
    </>
  );
};

export default App;
