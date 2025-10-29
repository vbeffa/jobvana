import { useCallback, useContext, useState } from 'react';
import { FaRunning } from 'react-icons/fa';
import { FaTrash } from 'react-icons/fa6';
import { JobSeekerContext } from '../../Context';
import ActiveFilters from '../../jobs/job_seekers/ActiveFilters';
import type { SearchFilters } from '../../jobs/job_seekers/useJobs';
import useSavedSearches from '../../jobs/job_seekers/useSavedSearches';
import { deleteSavedSearch } from '../../jobs/job_seekers/utils';
import JobvanaError from '../../JobvanaError';
import Modal from '../../Modal';
import { Route } from '../../routes/jobvana.jobs.index';

const SavedSearchesTable = ({
  jobSeekerId
  // savedSearches
}: {
  jobSeekerId: number;
  // savedSearches: Array<JobSeekerSavedSearch>;
}) => {
  const navigate = Route.useNavigate();
  const { setJobSearchFilters } = useContext(JobSeekerContext);

  const [isUpdating, setIsUpdating] = useState(false);
  const [updateError, setUpdateError] = useState<Error>();

  const { savedSearches, error, refetch } = useSavedSearches(jobSeekerId);

  const deleteSearch = useCallback(
    async (id: number) => {
      if (!confirm('Are you sure you want to delete this saved search?')) {
        return;
      }

      setIsUpdating(true);
      setUpdateError(undefined);
      try {
        await deleteSavedSearch(id);
        refetch();
        alert('Search deleted.');
      } catch (err) {
        console.log(err);
        setUpdateError(err as Error);
      } finally {
        setIsUpdating(false);
      }
    },
    [refetch]
  );

  const runSearch = useCallback(
    async (searchFilters: SearchFilters) => {
      setJobSearchFilters(searchFilters);
      navigate({
        from: '/jobvana',
        to: '/jobvana/jobs',
        search: {
          page: 1,
          ...searchFilters
        }
      });
    },
    [navigate, setJobSearchFilters]
  );

  if (error) {
    return <JobvanaError error={error} />;
  }

  return (
    <div>
      {isUpdating && <Modal type="updating" />}
      {updateError && <JobvanaError error={updateError} />}
      <table className="w-full">
        <thead>
          <tr>
            <th>Date</th>
            <th>Name</th>
            <th>Filters</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {savedSearches?.map((savedSearch, idx) => (
            <tr key={idx} className={idx % 2 === 1 ? 'bg-gray-200' : ''}>
              <td className="align-text-top">
                <div className="flex justify-center">
                  {new Date(savedSearch.created_at).toLocaleDateString()}
                </div>
              </td>
              <td className="align-text-top">
                <div className="px-2">{savedSearch.name}</div>
              </td>
              <td>
                {/* <div className="px-2">{filters(savedSearch.searchFilters)}</div> */}
                <div className="px-2 py-1 overflow-auto w-full h-full">
                  <ActiveFilters
                    filters={savedSearch.searchFilters}
                    savedSearch={true}
                  />
                </div>
              </td>
              <td>
                <div className="flex flex-row items-center gap-1 justify-center text-blue-500">
                  <FaRunning
                    className="hover:text-blue-400 cursor-pointer"
                    onClick={() => runSearch(savedSearch.searchFilters)}
                  />
                  <FaTrash
                    className="hover:text-blue-400 cursor-pointer"
                    onClick={() => deleteSearch(savedSearch.id)}
                  />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SavedSearchesTable;
