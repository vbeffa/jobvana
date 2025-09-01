import { useEffect, useMemo, useState } from 'react';
import { useDebounce } from 'use-debounce';
import Error from '../Error';
import useJobs, { type SearchFilters } from '../hooks/useJobs';
import PageNav from '../PageNav';
import SummaryCard from '../SummaryCard';
import JobDetails from './JobDetails';
import JobFilters from './JobFilters';

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
  const [jobId, setJobId] = useState<number | null>(null);

  const filters: SearchFilters = useMemo(
    () => ({
      ...searchFilters,
      company: debouncedCompany,
      title: debouncedTitle
    }),
    [debouncedCompany, debouncedTitle, searchFilters]
  );

  const { jobs, error, isPlaceholderData, isPending, openJobCount } = useJobs({
    paging: { page: debouncedPage, pageSize: 10 },
    filters
  });

  useEffect(() => {
    if (jobs?.[0]) {
      setJobId(jobs[0].id);
    }
  }, [jobs]);

  return (
    <>
      <h1>Jobs</h1>
      {error && <Error error={error} />}
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
          pageSize={10}
          total={openJobCount}
          onSetPage={setPage}
          isLoading={isPlaceholderData || isPending}
        />
      </div>
      <div className="card text-left flex flex-row gap-x-2">
        <div className="w-[20%]">
          {jobs?.map((job) => (
            <SummaryCard
              id={job.id}
              selected={jobId === job.id}
              onClick={() => setJobId(job.id)}
              title={job.title}
              text={
                <>
                  <div>{job.company?.name}</div>
                  <div>{job.role?.name}</div>
                </>
              }
            />
          ))}
        </div>
        <div className="w-[80%]">{jobId && <JobDetails id={jobId} />}</div>
      </div>{' '}
    </>
  );
};

export default Jobs;
