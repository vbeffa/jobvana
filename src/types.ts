import type { SearchFilters as CompanyApplicationSearchFilters } from './applications/company/useApplications';
import type { SearchFilters as JobSeekerApplicationSearchFilters } from './applications/job_seeker/useApplications';
import type { InterviewProcess } from './companies/company/utils';
import type { SearchFilters as CompanySearchFilters } from './companies/job_seeker/useCompanies';
import type { Database } from './db/types';
import type { SearchFilters as CompanyJobSearchFilters } from './jobs/company/useJobs';
import type { SearchFilters as JobSeekerJobSearchFilters } from './jobs/job_seekers/useJobs';
import type { SearchFilters as SkillSearchFilters } from './skills/useSkills';

export type Paging = { page: number; pageSize: number };
export type Params<
  SearchFilters extends
    | CompanySearchFilters
    | JobSeekerJobSearchFilters
    | SkillSearchFilters
    | CompanyJobSearchFilters
    | JobSeekerApplicationSearchFilters
    | CompanyApplicationSearchFilters
> = {
  paging: Paging;
  filters: SearchFilters;
};

export type Application = Database['public']['Tables']['applications']['Row'];
export type ApplicationEvent =
  Database['public']['Tables']['application_events']['Row'];
export type ApplicationStatus = Application['status'];
export type Company = Omit<
  Database['public']['Tables']['companies']['Row'],
  'interview_process'
> & {
  interview_process: InterviewProcess | null;
};
export type CompanyAddress =
  Database['public']['Tables']['company_addresses']['Row'];
export type CompanyTechStack =
  Database['public']['Tables']['company_tech_stacks']['Row'];
export type Industry = Database['public']['Tables']['industries']['Row'];
export type Interview = Database['public']['Tables']['interviews']['Row'];
// this is a derived status and is not stored in the interviews table
export type InterviewStatus =
  | 'pending'
  | 'in_process'
  | 'declined'
  | 'completed';
export type InterviewRoundEvent =
  Database['public']['Tables']['interview_round_events']['Row'];
export type InterviewRound =
  Database['public']['Tables']['interview_rounds']['Row'];
export type InterviewRoundStatus =
  Database['public']['Enums']['interview_round_status'];
export type Job = Database['public']['Tables']['jobs']['Row'];
export type JobSalaryType = Job['salary_type'];
export type JobStatus = Job['status'];
export type JobType = Job['type'];
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
