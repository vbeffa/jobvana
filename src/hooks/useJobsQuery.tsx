import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import supabase from "../utils/supabase";
import type { Database } from "../utils/types";
import useCompanies, { type Company } from "./useCompanies";
import useSkills, { type Skill, type SkillVersion } from "./useSkills";

export type Job = Database["public"]["Tables"]["jobs"]["Row"] & {
  company: Company | undefined;
  role: Role | undefined;
  skills: Array<Skill>;
  skillVersions: Array<SkillVersion>;
};

export type Role = Database["public"]["Tables"]["roles"]["Row"];
export type JobSkill = Database["public"]["Tables"]["job_skills"]["Row"];
export type JobSkillVersion =
  Database["public"]["Tables"]["job_skill_versions"]["Row"];

export type Jobs = {
  jobs: Array<Job> | undefined;
  isPlaceholderData: boolean;
  openJobCount: number | undefined;
};

export type JobsParams = {
  paging?: {
    page: number;
    pageSize: number;
  };
  filters: {
    company?: string;
    title?: string;
    minSalary?: number;
    maxSalary?: number;
  };
};

const useJobsQuery = (
  params: JobsParams = { paging: { page: 1, pageSize: 50 }, filters: {} }
): Jobs => {
  const { skills, findSkillVersion } = useSkills();
  const { findCompany } = useCompanies();

  const { isPlaceholderData, data: jobsData } = useQuery({
    queryKey: ["queryJobs", params?.paging?.page],
    queryFn: async () => {
      if (!params?.paging) {
        return null;
      }
      console.log("query", params);
      let q = supabase
        .from("jobs")
        .select("*, companies!inner(*)", { count: "exact" })
        .filter("status", "eq", "open");
      if (params.filters.company) {
        q = q.ilike("companies.name", `%${params.filters.company}%`);
      }
      const { data, count } = await q
        .range(
          (params.paging.page - 1) * params.paging.pageSize,
          params.paging.page * params.paging.pageSize - 1
        )
        .order("created_at", { ascending: false })
        .order("id"); // necessary in case there are rows with identical created_at values
      console.log(data);
      return { data, count };
    },
    placeholderData: keepPreviousData
  });

  const { data: rolesData } = useQuery({
    queryKey: ["roles"],
    queryFn: async () => {
      const { data } = await supabase.from("roles").select();
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

  const jobSkills = useMemo(() => jobSkillsData, [jobSkillsData]);

  const jobSkillVersions = useMemo(
    () => jobSkillVersionsData,
    [jobSkillVersionsData]
  );

  const roles = useMemo(() => rolesData, [rolesData]);

  const jobs = useMemo(() => {
    if (
      !jobsData?.data ||
      !jobSkills ||
      !jobSkillVersions ||
      !skills ||
      !roles
    ) {
      return undefined;
    }

    return jobsData.data.map((job) => {
      return {
        ...job,
        company: findCompany(job.company_id),
        role: roles.find((role) => role.id === job.role_id),
        skills: skills.filter((skill) =>
          jobSkills
            .filter((jobSkill) => jobSkill.job_id === job.id)
            .map((jobSkill) => jobSkill.skill_id)
            .includes(skill.id)
        ),
        skillVersions: jobSkillVersions
          .filter((jobSkillVersion) => jobSkillVersion.job_id === job.id)
          .map((jobSkillVersion) =>
            findSkillVersion(jobSkillVersion.skill_version_id)
          )
          .filter((skillVersion) => skillVersion !== undefined)
      };
    });
  }, [
    jobsData,
    jobSkills,
    jobSkillVersions,
    skills,
    roles,
    findCompany,
    findSkillVersion
  ]);

  const openJobCount = useMemo(
    () => jobsData?.count ?? undefined,
    [jobsData?.count]
  );

  return {
    jobs,
    isPlaceholderData,
    openJobCount
  };
};

export default useJobsQuery;
