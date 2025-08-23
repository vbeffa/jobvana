import { useEffect, useState } from "react";
import supabase from "../utils/supabase";
import type { Database } from "../utils/types";
import useSkills, { type Skill } from "./useSkills";

export type Job = Database["public"]["Tables"]["jobs"]["Row"] & {
  skills: Array<Skill>;
  salaryLow: number;
  salaryHigh: number;
};
export type Company = Database["public"]["Tables"]["companies"]["Row"];
export type JobSkill = Database["public"]["Tables"]["job_skills"]["Row"];

export type JobsQ = {
  all: Array<Job>;
  job: (id: number) => Job | undefined;
  forCompany: (companyId: number) => Array<Job>;
};

const useJobs = (): JobsQ => {
  const [jobs, setJobs] = useState<Array<Job>>([]);
  const [jobSkills, setJobSkills] = useState<Array<JobSkill>>([]);
  const skills = useSkills();

  useEffect(() => {
    if (jobs.length > 0 || jobSkills.length === 0 || skills.all.length === 0) {
      return;
    }
    (async () => {
      const { data } = await supabase.from("jobs").select();
      if (data === null) {
        return;
      }
      const jobs: Array<Job> = data.map((job) => {
        const salaryRange = (job.salary_range as string).split(",");
        const salaryLow = parseInt(salaryRange[0].substring(1));
        const salaryHigh = parseInt(salaryRange[1].substring(0)) - 1;
        return {
          ...job,
          skills: skills.all.filter((skill) =>
            jobSkills
              .filter((jobSkill) => jobSkill.job_id === job.id)
              .map((jobSkill) => jobSkill.skill_id)
              .includes(skill.id)
          ),
          salaryLow,
          salaryHigh
        };
      });
      setJobs(jobs);
    })();
  }, [jobSkills, jobSkills.length, jobs.length, skills]);

  useEffect(() => {
    if (jobSkills.length > 0) {
      return;
    }
    (async () => {
      const { data: jobSkills } = await supabase.from("job_skills").select();
      if (jobSkills === null) {
        return;
      }
      setJobSkills(jobSkills);
    })();
  }, [jobSkills.length]);

  return {
    all: jobs,
    job: (id: number) => {
      return jobs.find((job) => job.id === id);
    },
    forCompany: (companyId: number) => {
      return jobs.filter((job) => job.company_id === companyId);
    }
  };
};

export default useJobs;
