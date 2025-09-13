import { keepPreviousData, useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { useMemo } from 'react';
import type {
  Application,
  Company,
  Job as DbJob,
  Skill as DbSkill,
  Params
} from '../types';
import supabase from '../utils/supabase';
import type { JobRole } from './useJob';
import type { SearchFilters } from './useJobs';

export type Job = DbJob & {
  company: Company;
  jobRoles: Array<JobRole>;
  skills: Array<DbSkill>;
  // skillVersions: Array<SkillVersion>;
  applications: Array<Application> | undefined;
};

export type Jobs = {
  jobs: Array<Job> | undefined;
  error?: Error;
  isPlaceholderData: boolean;
  isPending: boolean;
  openJobCount: number | undefined;

  /** Includes skill versions for skill. */
  jobsForSkill: (skillId: number) => Array<Job> | undefined;
  // jobsForSkillVersion: (skillVersionId: number) => Array<Job> | undefined;
};

export type JobsParams = Params<SearchFilters>;

type QueryKey = {
  page: number;
} & SearchFilters;

// TODO this is unused, either use it or remove it
const useJobsForSkill = (
  // skillId: number,
  params: JobsParams = { paging: { page: 1, pageSize: 10 } }
): Jobs => {
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
    error,
    data: jobsData
  } = useQuery({
    queryKey: ['jobs', queryKey],
    queryFn: async () => {
      // console.log("query", params);
      let q = supabase
        .from('jobs')
        .select(
          '*, companies!jobs_company_id_fkey!inner(*), job_roles(*), skills(*), applications(*)',
          {
            count: 'exact'
          }
        )
        .filter('status', 'eq', 'open');

      const { filters } = params;
      if (filters?.company) {
        q = q.ilike('companies.name', `%${filters.company}%`);
      }
      if (filters?.companyId) {
        q = q.filter('companies.id', 'eq', filters.companyId);
      }
      if (filters?.title) {
        q = q.ilike('title', `%${filters.title}%`);
      }
      if (filters?.roleId) {
        // TODO not working
        q = q.filter('job_roles.role_id', 'eq', filters.roleId);
      }
      if (filters?.minSalary) {
        q = q.filter('salary_low', 'gte', filters.minSalary);
      }
      if (filters?.maxSalary) {
        q = q.filter('salary_high', 'lte', filters.maxSalary);
      }
      if (filters?.skillId) {
        q = q.eq('skills.id', filters.skillId);
      }
      if (filters?.created && filters.created !== 'all') {
        const createdAfter = (() => {
          switch (filters.created) {
            case 'today':
              return dayjs().startOf('day').toDate();
            case 'last_three_days':
              return dayjs().subtract(3, 'days').startOf('day').toDate();
            case 'last_week':
              return dayjs().subtract(7, 'days').startOf('day').toDate();
            case 'last_month':
              return dayjs().subtract(1, 'month').startOf('day').toDate();
          }
        })().toISOString();
        // console.log(createdAfter);
        q = q.filter('created_at', 'gte', createdAfter);
      }

      const { error, data, count } = await q
        .range(
          (params.paging.page - 1) * params.paging.pageSize,
          params.paging.page * params.paging.pageSize - 1
        )
        .order('created_at', { ascending: false })
        .overrideTypes<Array<{ companies: Company }>>();
      // console.log(data);
      if (error) {
        console.log(JSON.stringify(error));
      }
      return { error, data, count };
    },
    placeholderData: keepPreviousData
  });

  const jobs: Array<Job> | undefined = useMemo(() => {
    if (!jobsData?.data) {
      return undefined;
    }

    return jobsData.data.map((job) => {
      return {
        ...job,
        company: job.companies,
        jobRoles: job.job_roles
        // skillVersions: job.skill_versions
      };
    });
  }, [jobsData]);

  const openJobCount = useMemo(
    () => jobsData?.count ?? undefined,
    [jobsData?.count]
  );

  return {
    jobs,
    error: error ?? undefined,
    isPlaceholderData,
    isPending,
    openJobCount,

    // TODO fix - jobs are now paged, this needs to be in a separate hook
    jobsForSkill: (skillId: number) => {
      return jobs?.filter(
        (job) => job.skills.map((skill) => skill.id).includes(skillId)
        //  ||
        //   job.skill_versions
        //     .map((skillVersion) => skillVersion.skill_id)
        //     .includes(skillId)
      );
    }
    // jobsForSkillVersion: (skillVersionId: number) => {
    //   return jobs?.filter((job) =>
    //     job.skill_versions
    //       .map((skillVersion) => skillVersion.id)
    //       .includes(skillVersionId)
    //   );
    // }
  };
};

export default useJobsForSkill;
