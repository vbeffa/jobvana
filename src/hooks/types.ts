import type { Database } from '../utils/types';
import type { SearchFilters as CompanySearchFilters } from './useCompanies';
import type { SearchFilters as JobSearchFilters } from './useJobs';
import type { SearchFilters as SkillSearchFilters } from './useSkills';

export type Params<
  SF extends CompanySearchFilters | JobSearchFilters | SkillSearchFilters
> = {
  paging: {
    page: number;
    pageSize: number;
  };
  filters?: SF;
};

export type Job = Database['public']['Tables']['jobs']['Row'];

export type JobSeeker = Database['public']['Tables']['job_seekers']['Row'] & {
  user: User;
};

export type User = Database['public']['Tables']['users']['Row'];

export type Application = Database['public']['Tables']['applications']['Row'];

export type CompanyAddress =
  Database['public']['Tables']['company_addresses']['Row'];
export type Industry = Database['public']['Tables']['industries']['Row'];

export type Company = Database['public']['Tables']['companies']['Row'];

export type TechStack = Database['public']['Tables']['tech_stacks']['Row'];

export type InterviewRound =
  Database['public']['Tables']['interview_rounds']['Row'];

export type Interview = Database['public']['Tables']['interviews']['Row'] & {
  // rounds: Array<InterviewRound>;
};

export type Role = Database['public']['Tables']['roles']['Row'];

export type Skill = Database['public']['Tables']['skills']['Row'];

export type SkillRelation =
  Database['public']['Tables']['skill_relations']['Row'];

export type SkillVersion =
  Database['public']['Tables']['skill_versions']['Row'];

export type SkillCategory =
  Database['public']['Tables']['skill_categories']['Row'] & {
    childCategories: Array<SkillCategory>;
  };
