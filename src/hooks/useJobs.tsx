import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import supabase from "../utils/supabase";
import type { Database } from "../utils/types";
import useCompanies, { type Company } from "./useCompanies";
import useSkills, { type Skill, type SkillVersion } from "./useSkills";
import type { SearchFilters } from "../jobs/Jobs";

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
  isPending: boolean;
  openJobCount: number | undefined;

  queryJobs: () => Array<Job> | undefined;

  jobsForCompany: Array<Job> | undefined;
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
  const { findCompany } = useCompanies();

  const queryKey: QueryKey = useMemo(
    () => ({
      page: params.paging?.page,
      // https://tanstack.com/query/latest/docs/framework/react/guides/query-keys#query-keys-are-hashed-deterministically
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
      if (!params?.paging) {
        return null;
      }
      console.log("query", params);
      let q = supabase
        .from("jobs")
        .select("*, companies!inner(*)", { count: "exact" })
        .filter("status", "eq", "open");
      if (params.filters?.company) {
        q = q.ilike("companies.name", `%${params.filters.company}%`);
      }
      if (params.filters?.title) {
        q = q.ilike("title", `%${params.filters.title}%`);
      }
      if (params.filters?.roleId) {
        q = q.filter("role_id", "eq", params.filters.roleId);
      }
      if (params.filters?.minSalary) {
        q = q.filter("salary_low", "gte", params.filters.minSalary);
      }
      if (params.filters?.maxSalary) {
        q = q.filter("salary_high", "lte", params.filters.maxSalary);
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

  const { data: jobsForCompanyData } = useQuery({
    queryKey: ["jobsForCompany"],
    queryFn: async () => {
      if (!params?.companyId) {
        return null;
      }
      const { data, count } = await supabase
        .from("jobs")
        .select("*", { count: "exact" })
        .filter("company_id", "eq", params?.companyId)
        .order("created_at", { ascending: false });
      return { data, count };
    }
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

  const jobsForCompany = useMemo(() => {
    if (
      !jobsForCompanyData?.data ||
      !jobSkills ||
      !jobSkillVersions ||
      !skills ||
      !roles
    ) {
      return undefined;
    }
    return jobsForCompanyData.data.map((job) => {
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
    findCompany,
    findSkillVersion,
    jobSkillVersions,
    jobSkills,
    jobsForCompanyData,
    roles,
    skills
  ]);

  const openJobCount = useMemo(
    () => jobsData?.count ?? undefined,
    [jobsData?.count]
  );

  return {
    jobs,
    isPlaceholderData,
    isPending,
    openJobCount,

    queryJobs: () => {
      return undefined;
    },

    jobsForCompany,
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
