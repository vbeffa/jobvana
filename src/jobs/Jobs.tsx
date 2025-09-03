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
      {error && <Error error={error} />}
      <div className="px-[2em] mt-2 pb-4 text-left flex">
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
      <div className="border-y-[0.5px] border-y-blue-300 mx-8 mt-4 flex flex-row">
        <div className="border-l-[0.5px] border-l-blue-300 w-[20%]">
          <div className="h-12 pt-3 text-gray-400 text-center">
            Browsing {openJobCount} jobs
          </div>
          <div className="h-[calc(100dvh-333px)] overflow-y-auto">
            {jobs?.map((job) => (
              <SummaryCard
                key={job.id}
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
        </div>
        <div className="border-x-[0.5px] border-x-blue-300 pl-4 w-[80%] h-[calc(100vh-285px)] overflow-y-auto">
          {jobId && <JobDetails id={jobId} />}
        </div>
      </div>{' '}
    </>
  );
};

export default Jobs;
