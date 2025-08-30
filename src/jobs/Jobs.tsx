import { useMemo, useState } from 'react';
import { useDebounce } from 'use-debounce';
import useJobs, { type SearchFilters } from '../hooks/useJobs';
import JobFilters from './JobFilters';
import JobsTable from './JobsTable';
import PageNav from '../PageNav';

const Jobs = () => {
  const [page, setPage] = useState<number>(1);
  const [debouncedPage] = useDebounce(page, 500);
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({
    company: '',
    title: ''
  });
  const [debouncedCompany] = useDebounce(
    searchFilters.company,
    searchFilters.company ? 1000 : 0
  );
  const [debouncedTitle] = useDebounce(
    searchFilters.title,
    searchFilters.title ? 1000 : 0
  );

  const filters: SearchFilters = useMemo(
    () => ({
      ...searchFilters,
      company: debouncedCompany,
      title: debouncedTitle
    }),
    [debouncedCompany, debouncedTitle, searchFilters]
  );

  const { jobs, error, isPlaceholderData, isPending, openJobCount } = useJobs({
    paging: { page: debouncedPage, pageSize: 50 },
    filters
  });

  return (
    <>
      <h1>Jobs</h1>
      {error && <div className="text-red-500">{error}</div>}
      <div className="px-[2em] pb-4 text-left flex">
        <JobFilters
          filters={searchFilters}
          setFilters={(filters) => {
            setPage(1);
            setSearchFilters(filters);
          }}
        />
      </div>
      <div className="px-[2em]">
        <PageNav
          page={page}
          total={openJobCount}
          onSetPage={setPage}
          isLoading={isPlaceholderData || isPending}
        />
      </div>
      <div className="card">
        <JobsTable jobs={jobs} />
      </div>
    </>
  );
};

export default Jobs;
