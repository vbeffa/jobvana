import _ from 'lodash';
import { useMemo, type Dispatch, type SetStateAction } from 'react';
import useIndustries from '../../companies/useIndustries';
import PillContainer from '../../containers/PillContainer';
import useRoles from '../../roles/useRoles';
import useSkillsLite from '../../skills/useSkillsLite';
import {
  createdRangeToString,
  INITIAL_SEARCH_FILTERS,
  jobTypeToString
} from '../utils';
import type { SearchFilters } from './useJobs';

const ActiveFilters = ({
  filters,
  setFilters
}: {
  filters: SearchFilters;
  setFilters: Dispatch<SetStateAction<SearchFilters>>;
}) => {
  const { findIndustry } = useIndustries();
  const { findRole } = useRoles();
  const { skills } = useSkillsLite();

  const selectedSkills = useMemo(
    () =>
      filters.skillIds?.length
        ? skills?.filter((skill) => filters.skillIds?.includes(skill.id))
        : undefined,
    [filters.skillIds, skills]
  );

  const industry = useMemo(
    () => (filters.industryId ? findIndustry(filters.industryId) : undefined),
    [filters.industryId, findIndustry]
  );

  const role = useMemo(
    () => (filters.roleId ? findRole(filters.roleId) : undefined),
    [filters.roleId, findRole]
  );

  const jobType = useMemo(
    () => (filters.jobType ? jobTypeToString(filters.jobType) : undefined),
    [filters.jobType]
  );

  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  });

  return (
    <div className="flex gap-2 whitespace-nowrap">
      {filters.company && (
        <div className="flex flex-row gap-2">
          <div className="content-center">Company Name:</div>
          <PillContainer
            onDelete={() => {
              setFilters((filters) => ({
                ...filters,
                company: INITIAL_SEARCH_FILTERS.company
              }));
            }}
          >
            {filters.company}
          </PillContainer>
        </div>
      )}
      {(filters.minSize > INITIAL_SEARCH_FILTERS.minSize ||
        filters.maxSize < INITIAL_SEARCH_FILTERS.maxSize) && (
        <div className="flex flex-row gap-2">
          <div className="content-center">Size:</div>
          <PillContainer
            onDelete={() => {
              setFilters((filters) => ({
                ...filters,
                minSize: INITIAL_SEARCH_FILTERS.minSize,
                maxSize: INITIAL_SEARCH_FILTERS.maxSize
              }));
            }}
          >{`${filters.minSize} - ${filters.maxSize}`}</PillContainer>
        </div>
      )}
      {industry && (
        <div className="flex flex-row gap-2">
          <div className="content-center">Industry:</div>
          <PillContainer
            onDelete={() => {
              setFilters((filters) => ({
                ...filters,
                industryId: INITIAL_SEARCH_FILTERS.industryId
              }));
            }}
          >
            {industry.name}
          </PillContainer>
        </div>
      )}
      {filters.title && (
        <div className="flex flex-row gap-2">
          <div className="content-center">Job Title:</div>
          <PillContainer
            onDelete={() => {
              setFilters((filters) => ({
                ...filters,
                title: INITIAL_SEARCH_FILTERS.title
              }));
            }}
          >
            {filters.title}
          </PillContainer>
        </div>
      )}
      {role && (
        <div className="flex flex-row gap-2">
          <div className="content-center">Role:</div>
          <PillContainer
            onDelete={() => {
              setFilters((filters) => ({
                ...filters,
                roleId: INITIAL_SEARCH_FILTERS.roleId
              }));
            }}
          >
            {role.name}
          </PillContainer>
        </div>
      )}
      {jobType && (
        <div className="flex flex-row gap-2">
          <div className="content-center">Job Type:</div>
          <PillContainer
            onDelete={() => {
              setFilters((filters) => ({
                ...filters,
                jobType: INITIAL_SEARCH_FILTERS.jobType
              }));
            }}
          >
            {jobType}
          </PillContainer>
        </div>
      )}
      <div className="flex flex-row gap-2">
        <div className="content-center">Salary Type:</div>
        <PillContainer>{_.capitalize(filters.salaryType)}</PillContainer>
      </div>
      {(filters.minSalary > INITIAL_SEARCH_FILTERS.minSalary ||
        filters.maxSalary < INITIAL_SEARCH_FILTERS.maxSalary) && (
        <div className="flex flex-row gap-2">
          <div className="content-center">Salary Range:</div>
          <PillContainer
            onDelete={() => {
              setFilters((filters) => ({
                ...filters,
                minSalary: INITIAL_SEARCH_FILTERS.minSalary,
                maxSalary: INITIAL_SEARCH_FILTERS.maxSalary
              }));
            }}
          >{`${formatter.format(filters.minSalary)} - ${formatter.format(filters.maxSalary)}`}</PillContainer>
        </div>
      )}
      {filters.created !== 'all' && (
        <div className="flex flex-row gap-2">
          <div className="content-center">Posted:</div>
          <PillContainer
            onDelete={() => {
              setFilters((filters) => ({
                ...filters,
                created: INITIAL_SEARCH_FILTERS.created
              }));
            }}
          >
            {createdRangeToString(filters.created)}
          </PillContainer>
        </div>
      )}
      {selectedSkills && (
        <div className="flex flex-row gap-2">
          <div className="content-center">Skills:</div>
          {selectedSkills.map((skill) => (
            <div key={skill.id}>
              <PillContainer>{skill.abbreviation ?? skill.name}</PillContainer>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ActiveFilters;
