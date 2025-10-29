import _ from 'lodash';
import { useContext, useMemo, type Dispatch, type SetStateAction } from 'react';
import useIndustries from '../../companies/useIndustries';
import PillContainer from '../../containers/PillContainer';
import { JobSeekerContext } from '../../Context';
import useRoles from '../../roles/useRoles';
import useSkillsLite from '../../skills/useSkillsLite';
import { formatCurrency } from '../../utils';
import {
  createdRangeToString,
  INITIAL_SEARCH_FILTERS,
  jobTypeToString
} from '../utils';
import type { SearchFilters } from './useJobs';

const ActiveFilters = ({
  filters,
  setFilters,
  savedSearch
}: {
  filters: SearchFilters;
  setFilters?: Dispatch<SetStateAction<SearchFilters>>;
  savedSearch?: boolean;
}) => {
  const { setJobSearchFilters } = useContext(JobSeekerContext);
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

  // const jobType = useMemo(
  //   () => (filters.jobType ? jobTypeToString(filters.jobType) : undefined),
  //   [filters.jobType]
  // );

  return (
    <div
      className={
        savedSearch ? 'flex flex-col gap-2' : 'flex gap-2 whitespace-nowrap'
      }
    >
      {filters.company && (
        <div className="flex flex-row gap-2">
          <div className="content-center">Company Name:</div>
          <PillContainer
            onDelete={
              setFilters
                ? () => {
                    const updatedFilters = {
                      ...filters,
                      company: INITIAL_SEARCH_FILTERS.company
                    };
                    setFilters(updatedFilters);
                    setJobSearchFilters(updatedFilters);
                  }
                : undefined
            }
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
            onDelete={
              setFilters
                ? () => {
                    const updatedFilters = {
                      ...filters,
                      minSize: INITIAL_SEARCH_FILTERS.minSize,
                      maxSize: INITIAL_SEARCH_FILTERS.maxSize
                    };
                    setFilters(updatedFilters);
                    setJobSearchFilters(updatedFilters);
                  }
                : undefined
            }
          >{`${filters.minSize} - ${filters.maxSize}`}</PillContainer>
        </div>
      )}
      {industry && (
        <div className="flex flex-row gap-2">
          <div className="content-center">Industry:</div>
          <PillContainer
            onDelete={
              setFilters
                ? () => {
                    const updatedFilters = {
                      ...filters,
                      industryId: INITIAL_SEARCH_FILTERS.industryId
                    };
                    setFilters(updatedFilters);
                    setJobSearchFilters(updatedFilters);
                  }
                : undefined
            }
          >
            {industry.name}
          </PillContainer>
        </div>
      )}
      {filters.title && (
        <div className="flex flex-row gap-2">
          <div className="content-center">Job Title:</div>
          <PillContainer
            onDelete={
              setFilters
                ? () => {
                    const updatedFilters = {
                      ...filters,
                      title: INITIAL_SEARCH_FILTERS.title
                    };
                    setFilters(updatedFilters);
                    setJobSearchFilters(updatedFilters);
                  }
                : undefined
            }
          >
            {filters.title}
          </PillContainer>
        </div>
      )}
      {filters.description && (
        <div className="flex flex-row gap-2">
          <div className="content-center">Description:</div>
          <PillContainer
            onDelete={
              setFilters
                ? () => {
                    const updatedFilters = {
                      ...filters,
                      description: INITIAL_SEARCH_FILTERS.description
                    };
                    setFilters(updatedFilters);
                    setJobSearchFilters(updatedFilters);
                  }
                : undefined
            }
          >
            {filters.description}
          </PillContainer>
        </div>
      )}
      {role && (
        <div className="flex flex-row gap-2">
          <div className="content-center">Role:</div>
          <PillContainer
            onDelete={
              setFilters
                ? () => {
                    const updatedFilters = {
                      ...filters,
                      roleId: INITIAL_SEARCH_FILTERS.roleId
                    };
                    setFilters(updatedFilters);
                    setJobSearchFilters(updatedFilters);
                  }
                : undefined
            }
          >
            {role.name}
          </PillContainer>
        </div>
      )}
      {filters.jobType !== 'any' && (
        <div className="flex flex-row gap-2">
          <div className="content-center">Job Type:</div>
          <PillContainer
            onDelete={
              setFilters
                ? () => {
                    const updatedFilters = {
                      ...filters,
                      jobType: INITIAL_SEARCH_FILTERS.jobType
                    };
                    setFilters(updatedFilters);
                    setJobSearchFilters(updatedFilters);
                  }
                : undefined
            }
          >
            {jobTypeToString(filters.jobType)}
          </PillContainer>
        </div>
      )}
      <div className="flex flex-row gap-2">
        <div className="content-center">Salary Type:</div>
        <PillContainer>{_.capitalize(filters.salaryType)}</PillContainer>
      </div>
      <div className="flex flex-row gap-2">
        <div className="content-center">Salary Range:</div>
        <PillContainer>{`${formatCurrency(filters.minSalary)} - ${formatCurrency(filters.maxSalary)}`}</PillContainer>
      </div>
      {filters.created !== 'all' && (
        <div className="flex flex-row gap-2">
          <div className="content-center">Posted:</div>
          <PillContainer
            onDelete={
              setFilters
                ? () => {
                    const updatedFilters = {
                      ...filters,
                      created: INITIAL_SEARCH_FILTERS.created
                    };
                    setFilters(updatedFilters);
                    setJobSearchFilters(updatedFilters);
                  }
                : undefined
            }
          >
            {createdRangeToString(filters.created)}
          </PillContainer>
        </div>
      )}
      {filters.showApplied && (
        <PillContainer
          onDelete={
            setFilters
              ? () => {
                  const updatedFilters = {
                    ...filters,
                    showApplied: INITIAL_SEARCH_FILTERS.showApplied
                  };
                  setFilters(updatedFilters);
                  setJobSearchFilters(updatedFilters);
                }
              : undefined
          }
        >
          Show Applied
        </PillContainer>
      )}
      {filters.hideSaved && (
        <PillContainer
          onDelete={
            setFilters
              ? () => {
                  const updatedFilters = {
                    ...filters,
                    hideSaved: INITIAL_SEARCH_FILTERS.hideSaved
                  };
                  setFilters(updatedFilters);
                  setJobSearchFilters(updatedFilters);
                }
              : undefined
          }
        >
          Hide Saved
        </PillContainer>
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
