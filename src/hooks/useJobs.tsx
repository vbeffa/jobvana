import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import supabase from "../utils/supabase";
import type { Database } from "../utils/types";
import { type Company } from "./useCompanies";
import useSkills, { type Skill, type SkillVersion } from "./useSkills";

export type SearchFilters = {
  company?: string;
  companyId?: number;
  title?: string;
  roleId?: number;
  minSalary?: number;
  maxSalary?: number;
  skillId?: number;
};

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
  error?: string;
  isPlaceholderData: boolean;
  isPending: boolean;
  openJobCount: number | undefined;

  /** Includes skill versions for skill. */
  jobsForSkill: (skillId: number) => Array<Job> | undefined;
  jobsForSkillVersion: (skillVersionId: number) => Array<Job> | undefined;
};

export type JobsParams = {
  paging: {
    page: number;
    pageSize: number;
  };
  filters?: SearchFilters;
  companyId?: number;
};

type QueryKey = {
  page: number;
} & SearchFilters;

const useJobs = (
  params: JobsParams = { paging: { page: 1, pageSize: 50 } }
): Jobs => {
  const { skills, findSkillVersion } = useSkills();

  const queryKey: QueryKey = useMemo(
    () => ({
      page: params.paging?.page,
      ...params.filters
    }),
    [params.filters, params.paging?.page]
  );

  const {
    isPlaceholderData,
    isPending,
    data: jobsData
  } = useQuery({
    queryKey: ["jobs", queryKey],
    queryFn: async () => {
      // console.log("query", params);
      let q = supabase
        .from("jobs")
        .select(
          "*, companies!inner(*), roles!inner(*), job_skills(*), skills(*)",
          {
            count: "exact"
          }
        )
        // .is("skills", null)
        .filter("status", "eq", "open");

      const { filters } = params;
      if (filters?.company) {
        q = q.ilike("companies.name", `%${filters.company}%`);
      }
      if (filters?.companyId) {
        q = q.filter("companies.id", "eq", filters.companyId);
      }
      if (filters?.title) {
        q = q.ilike("title", `%${filters.title}%`);
      }
      if (filters?.roleId) {
        q = q.filter("role_id", "eq", filters.roleId);
      }
      if (filters?.minSalary) {
        q = q.filter("salary_low", "gte", filters.minSalary);
      }
      if (filters?.maxSalary) {
        q = q.filter("salary_high", "lte", filters.maxSalary);
      }
      if (filters?.skillId) {
        q = q.filter("skills.id", "eq", filters.skillId);
      }
      const { error, data, count } = await q
        .range(
          (params.paging.page - 1) * params.paging.pageSize,
          params.paging.page * params.paging.pageSize - 1
        )
        .order("created_at", { ascending: false });
      console.log(data);
      console.log(error?.name);
      return { error, data, count };
    },
    placeholderData: keepPreviousData
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

  const jobs = useMemo(() => {
    if (!jobsData?.data || !jobSkills || !jobSkillVersions || !skills) {
      return undefined;
    }

    return jobsData.data.map((job) => {
      return {
        ...job,
        company: job.companies,
        role: job.roles,
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
  }, [jobsData, jobSkills, jobSkillVersions, skills, findSkillVersion]);

  const openJobCount = useMemo(
    () => jobsData?.count ?? undefined,
    [jobsData?.count]
  );

  return {
    jobs,
    error: jobsData?.error?.message,
    isPlaceholderData,
    isPending,
    openJobCount,

    jobsForSkill: (skillId: number) => {
      return jobs?.filter(
        (job) =>
          job.skills.map((skill) => skill.id).includes(skillId) ||
          job.skillVersions
            .map((skillVersion) => skillVersion.skill_id)
            .includes(skillId)
      );
    },
    jobsForSkillVersion: (skillVersionId: number) => {
      return jobs?.filter((job) =>
        job.skillVersions
          .map((skillVersion) => skillVersion.id)
          .includes(skillVersionId)
      );
    }
  };
};

export default useJobs;
