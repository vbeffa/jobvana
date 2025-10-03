import type { SearchFilters as CompanySearchFilters } from './companies/job_seeker/useCompanies';
import type { Database } from './db/types';
import type { SearchFilters as JobSearchFilters } from './jobs/job_seekers/useJobs';
import type { SearchFilters as SkillSearchFilters } from './skills/useSkills';

export type Params<
  SearchFilters extends
    | CompanySearchFilters
    | JobSearchFilters
    | SkillSearchFilters
> = {
  paging: {
    page: number;
    pageSize: number;
  };
  filters: SearchFilters;
};

export type Application = Database['public']['Tables']['applications']['Row'];
export type Company = Database['public']['Tables']['companies']['Row'];
export type CompanyAddress =
  Database['public']['Tables']['company_addresses']['Row'];
export type CompanyTechStack =
  Database['public']['Tables']['company_tech_stacks']['Row'];
export type Industry = Database['public']['Tables']['industries']['Row'];
export type InterviewRound =
  Database['public']['Tables']['interview_rounds']['Row'];
export type Interview = Database['public']['Tables']['interviews']['Row'] & {
  // rounds: Array<InterviewRound>;
};
export type Job = Database['public']['Tables']['jobs']['Row'];
export type JobRole = Database['public']['Tables']['job_roles']['Row'];
export type JobSeeker = Database['public']['Tables']['job_seekers']['Row'];
export type JobSeekerSkill =
  Database['public']['Tables']['job_seeker_skills']['Row'];
export type JobSkill = Database['public']['Tables']['job_skills']['Row'];
export type JobSkillVersion =
  Database['public']['Tables']['job_skill_versions']['Row'];
export type Role = Database['public']['Tables']['roles']['Row'];
export type Skill = Database['public']['Tables']['skills']['Row'];
export type SkillRelation =
  Database['public']['Tables']['skill_relations']['Row'];
export type SkillVersion =
  Database['public']['Tables']['skill_versions']['Row'];
export type SkillCategory =
  Database['public']['Tables']['skill_categories']['Row'];
