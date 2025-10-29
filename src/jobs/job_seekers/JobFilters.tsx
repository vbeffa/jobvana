import _ from 'lodash';
import { useCallback, useMemo, useState } from 'react';
import IndustrySelect from '../../companies/IndustrySelect';
import CompanySizeFilters from '../../companies/job_seeker/CompanySizeFilters';
import FiltersSelectContainer from '../../containers/FiltersSelectContainer';
import Button from '../../controls/Button';
import supabase from '../../db/supabase';
import Filter from '../../inputs/Filter';
import Label from '../../inputs/Label';
import JobvanaError from '../../JobvanaError';
import Modal from '../../Modal';
import JobTypeSelect from '../company/JobTypeSelect';
import SalaryTypeSelect from '../company/SalaryTypeSelect';
import RoleSelect from '../RoleSelect';
import SkillsSelect from '../SkillsSelect';
import { maxJobSalary, minJobSalary } from '../utils';
import CreatedSelect from './CreatedSelect';
import SalaryRangeSelect from './SalaryRangeSelect';
import type { SearchFilters } from './useJobs';
import useSavedSearches from './useSavedSearches';

const JobFilters = ({
  filters,
  setShowFilters,
  jobSeekerId,
  onChange
}: {
  filters: SearchFilters;
  setShowFilters: (showFilters: boolean) => void;
  jobSeekerId: number;
  onChange: (filters: SearchFilters) => void;
}) => {
  const [newFilters, setNewFilters] = useState<SearchFilters>(filters);
  const [searchName, setSearchName] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<Error>();

  const { savedSearches, error, refetch } = useSavedSearches(jobSeekerId);

  const isDirty = useMemo(
    () => !_.isEqual(filters, newFilters),
    [filters, newFilters]
  );

  const saveSearch = useCallback(async () => {
    let existingSearch = savedSearches?.find((savedSearch) =>
      _.isEqual(savedSearch.name, searchName)
    );
    if (existingSearch) {
      alert(
        `A saved search with the name "${existingSearch.name}" already exists.`
      );
      return;
    }

    let replaceSearch = false;
    existingSearch = savedSearches?.find((savedSearch) =>
      _.isEqual(savedSearch.searchFilters, newFilters)
    );
    if (existingSearch) {
      if (
        !confirm(
          `These filters already exist under the saved search "${existingSearch.name}" - replace?`
        )
      ) {
        return;
      }
      replaceSearch = true;
    }

    setIsSaving(true);
    try {
      if (replaceSearch && existingSearch) {
        const { error } = await supabase
          .from('job_seeker_saved_searches')
          .update({
            job_seeker_id: jobSeekerId,
            name: searchName,
            search_filters: newFilters
          })
          .eq('id', existingSearch.id);
        if (error) {
          console.log(error);
          setSaveError(error);
          return;
        }
      } else {
        const { error } = await supabase
          .from('job_seeker_saved_searches')
          .insert({
            job_seeker_id: jobSeekerId,
            name: searchName,
            search_filters: newFilters
          });
        if (error) {
          console.log(error);
          setSaveError(error);
          return;
        }
      }

      refetch();
      alert('Search saved.');
      setSearchName('');
    } finally {
      setIsSaving(false);
    }
  }, [jobSeekerId, newFilters, refetch, savedSearches, searchName]);

  return (
    <FiltersSelectContainer>
      {error && (
        <JobvanaError prefix="Error loading saved searches" error={error} />
      )}
      {saveError && (
        <JobvanaError prefix="Error saving search" error={saveError} />
      )}
      {isSaving && <Modal type="saving" />}
      <div className="h-full px-2 pt-4 w-full flex flex-row gap-x-4">
        <div className="flex flex-col justify-between">
          <div className="grid grid-cols-[32%_68%] w-[480px] gap-y-2">
            <Label htmlFor="company_filter" label="Company Name" />
            <Filter
              id="company_filter"
              width="w-full"
              maxLength={25}
              placeholder="Filter by company"
              value={newFilters.company}
              onChange={(company) => {
                setNewFilters({ ...newFilters, company });
              }}
              onClear={() => setNewFilters({ ...newFilters, company: '' })}
            />
            <Label htmlFor="min_size" label="Company Size" />
            <CompanySizeFilters
              low={newFilters.minSize}
              high={newFilters.maxSize}
              width="w-full"
              onChangeLow={(size) => {
                if (!size) {
                  return;
                }
                setNewFilters({
                  ...newFilters,
                  minSize: size,
                  maxSize: size > newFilters.maxSize ? size : newFilters.maxSize
                });
              }}
              onChangeHigh={(size) => {
                if (!size) {
                  return;
                }
                setNewFilters({
                  ...newFilters,
                  maxSize: size,
                  minSize: size < newFilters.minSize ? size : newFilters.minSize
                });
              }}
            />
            <Label htmlFor="industry" label="Industry" />
            <IndustrySelect
              industryId={newFilters.industryId}
              width="w-full"
              showAny={true}
              onChange={(industryId) => {
                setNewFilters({ ...newFilters, industryId });
              }}
            />
            <Label htmlFor="job_title_filter" label="Job Title" />
            <Filter
              id="job_title_filter"
              width="w-full"
              maxLength={50}
              placeholder="Enter keywords"
              value={newFilters.title}
              onChange={(title) => {
                setNewFilters({ ...newFilters, title });
              }}
              onClear={() => setNewFilters({ ...newFilters, title: '' })}
            />
            <Label htmlFor="description" label="Description" />
            <Filter
              id="description"
              width="w-full"
              maxLength={50}
              placeholder="Enter keywords"
              value={newFilters.description}
              onChange={(description) => {
                setNewFilters({ ...newFilters, description });
              }}
              onClear={() => setNewFilters({ ...newFilters, description: '' })}
            />
            <Label htmlFor="role" label="Role" />
            <RoleSelect
              id="role"
              roleId={newFilters.roleId}
              width="w-full"
              onChange={(roleId) => {
                if (!roleId) {
                  setNewFilters({ ...newFilters, roleId: undefined });
                } else {
                  setNewFilters({ ...newFilters, roleId });
                }
              }}
            />
            <Label htmlFor="job_type" label="Job Type" />
            <JobTypeSelect
              value={newFilters.jobType}
              width="w-full"
              showAny={true}
              onChange={(jobType) => {
                setNewFilters({ ...newFilters, jobType });
              }}
            />
            <Label htmlFor="salary_type" label="Salary Type" />
            <SalaryTypeSelect
              value={newFilters.salaryType}
              width="w-[calc(50%-11px)]"
              onChange={(salaryType) => {
                const updatedFilters = {
                  ...newFilters,
                  salaryType,
                  minSalary: minJobSalary(salaryType),
                  maxSalary: maxJobSalary(salaryType)
                };
                setNewFilters(updatedFilters);
              }}
            />
            <Label htmlFor="min_salary" label="Salary Range" />
            <SalaryRangeSelect
              type={newFilters.salaryType}
              low={newFilters.minSalary}
              high={newFilters.maxSalary}
              width="w-full"
              onChangeLow={(minSalary) => {
                const updatedFilters = {
                  ...newFilters,
                  minSalary,
                  maxSalary:
                    newFilters.maxSalary && minSalary > newFilters.maxSalary
                      ? minSalary
                      : newFilters.maxSalary
                };
                setNewFilters(updatedFilters);
              }}
              onChangeHigh={(maxSalary) => {
                const updatedFilters = {
                  ...newFilters,
                  maxSalary,
                  minSalary:
                    newFilters.minSalary && maxSalary < newFilters.minSalary
                      ? maxSalary
                      : newFilters.minSalary
                };
                setNewFilters(updatedFilters);
              }}
            />
            <Label htmlFor="created" label="Posted" />
            <CreatedSelect
              id="created"
              value={newFilters.created}
              // width="w-[calc(50%-11px)]"
              width="w-full"
              onChange={(created) => {
                setNewFilters({ ...newFilters, created });
              }}
            />
            <div className="col-span-2 py-1 border-b-[0.5px] border-blue-300" />
            <div>Additional Filters:</div>
            <div className="flex flex-row gap-1">
              <input
                id="show_applied"
                type="checkbox"
                checked={newFilters.showApplied}
                onChange={() => {
                  setNewFilters({
                    ...newFilters,
                    showApplied: !newFilters.showApplied
                  });
                }}
              />
              <label htmlFor="show_applied">Show applied</label>
            </div>
            <div />
            <div className="flex flex-row gap-1">
              <input
                id="hide_saved"
                type="checkbox"
                checked={newFilters.hideSaved}
                onChange={() => {
                  setNewFilters({
                    ...newFilters,
                    hideSaved: !newFilters.hideSaved
                  });
                }}
              />
              <label htmlFor="hide_saved">Hide saved</label>
            </div>
          </div>
          <div className="grid grid-cols-[32%_52%_16%] w-[480px] py-4">
            <Label htmlFor="save_search" label="Save this search" />
            <Filter
              id="save_search"
              width="w-[calc(100%-4px)]"
              maxLength={25}
              placeholder="Enter a name"
              value={searchName}
              onChange={setSearchName}
              onClear={() => setSearchName('')}
            />
            <Button
              label="Save"
              disabled={!searchName || isSaving}
              onClick={saveSearch}
            />
          </div>
        </div>
        <div className="flex flex-col w-full justify-between">
          <div className="grid grid-cols-1 gap-y-2">
            <SkillsSelect
              selectedSkillIds={newFilters.skillIds ?? []}
              width="w-full"
              outerHeight="h-88.75"
              innerHeight="max-h-87.75"
              onChange={(skillIds) => {
                setNewFilters({ ...newFilters, skillIds: skillIds });
              }}
            />
          </div>
          <div className="grid grid-cols-1 py-4">
            <div className="flex flex-row justify-end gap-2">
              <Button
                label="Cancel"
                onClick={() => {
                  setShowFilters(false);
                }}
              />
              <Button
                label="Apply"
                disabled={!isDirty}
                onClick={() => {
                  onChange(newFilters);
                  setShowFilters(false);
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </FiltersSelectContainer>
  );
};

export default JobFilters;
