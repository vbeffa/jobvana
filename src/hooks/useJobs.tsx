import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import supabase from "../utils/supabase";
import type { Database } from "../utils/types";
import useSkills, { type Skill, type SkillVersion } from "./useSkills";
import useCompanies, { type Company } from "./useCompanies";

export type Job = Database["public"]["Tables"]["jobs"]["Row"] & {
  company: Company | undefined;
  skills: Array<Skill>;
  skillVersions: Array<SkillVersion>;
  salaryLow: number;
  salaryHigh: number;
};
export type JobSkill = Database["public"]["Tables"]["job_skills"]["Row"];
export type JobSkillVersion =
  Database["public"]["Tables"]["job_skill_versions"]["Row"];

export type Jobs = {
  jobs: Array<Job> | undefined;
  forCompany: (companyId: number) => Array<Job> | undefined;
  forSkill: (skillId: number) => Array<Job> | undefined;
};

const useJobs = (): Jobs => {
  const { skills, skillVersion } = useSkills();
  const { findCompany } = useCompanies();

  const { data: jobsData } = useQuery({
    queryKey: ["jobs"],
    queryFn: async () => {
      const { data } = await supabase.from("jobs").select();
      return data;
    }
  });

  const { data: jobSkillsData } = useQuery({
    queryKey: ["jobSkills"],
    queryFn: async () => {
      const { data } = await supabase.from("job_skills").select();
      return data;
    }
  });

  const { data: jobSkillVersionsData } = useQuery({
    queryKey: ["jobSkillVersions"],
    queryFn: async () => {
      const { data } = await supabase.from("job_skill_versions").select();
      return data;
    }
  });

  const jobSkills = useMemo(() => {
    return jobSkillsData;
  }, [jobSkillsData]);

  const jobSkillVersions = useMemo(() => {
    return jobSkillVersionsData;
  }, [jobSkillVersionsData]);

  const jobs = useMemo(() => {
    if (!jobsData || !jobSkills || !jobSkillVersions || !skills) {
      return undefined;
    }

    return jobsData
      .map((job) => {
        const salaryRange = (job.salary_range as string).split(",");
        const salaryLow = parseInt(salaryRange[0].substring(1));
        const salaryHigh = parseInt(salaryRange[1].substring(0)) - 1;
        return {
          ...job,
          company: findCompany(job.company_id),
          skills: skills.filter((skill) =>
            jobSkills
              .filter((jobSkill) => jobSkill.job_id === job.id)
              .map((jobSkill) => jobSkill.skill_id)
              .includes(skill.id)
          ),
          skillVersions: jobSkillVersions
            .filter((jobSkillVersion) => jobSkillVersion.job_id === job.id)
            .map((jobSkillVersion) =>
              skillVersion(jobSkillVersion.skill_version_id)
            )
            .filter((skillVersion) => skillVersion !== undefined),
          salaryLow,
          salaryHigh
        };
      })
      .sort((job1, job2) => {
        return (
          new Date(job2.created_at).getTime() -
          new Date(job1.created_at).getTime()
        );
      });
  }, [
    findCompany,
    jobSkillVersions,
    jobSkills,
    jobsData,
    skillVersion,
    skills
  ]);

  return {
    jobs: jobs,
    forCompany: (companyId: number) => {
      return jobs?.filter((job) => job.company_id === companyId);
    },
    forSkill: (skillId: number) => {
      return jobs?.filter((job) =>
        job.skills.map((skill) => skill.id).includes(skillId)
      );
    }
  };
};

export default useJobs;
