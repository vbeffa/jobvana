import { useEffect, useMemo, useState } from 'react';
import { useDebounce } from 'use-debounce';
import Error from '../Error';
import useJobs, { type JobsParams, type SearchFilters } from '../hooks/useJobs';
import PageNav from '../PageNav';
import SummaryCard from '../SummaryCard';
import JobDetails from './JobDetails';
import JobFilters from './JobFilters';

const Jobs = () => {
  const [page, setPage] = useState<number>(1);
  const [debouncePage, setDebouncePage] = useState(false);
  const [debouncedPage] = useDebounce(page, debouncePage ? 500 : 0);
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

  const paging: JobsParams['paging'] = useMemo(
    () => ({ page: debouncedPage, pageSize: 10 }),
    [debouncedPage]
  );

  const { jobs, error, isPlaceholderData, isPending, openJobCount } = useJobs({
    paging,
    filters
  });

  useEffect(() => {
    if (jobs?.[0]) {
      setJobId(jobs[0].id);
    } else {
      setJobId(null);
    }
  }, [jobs]);

  return (
    <div className="mx-4">
      {error && <Error error={error} />}
      <div className="my-4 flex justify-center">
        <JobFilters
          filters={searchFilters}
          setFilters={(filters) => {
            setPage(1);
            setSearchFilters(filters);
          }}
        />
      </div>
      <div className="flex justify-center">
        <div className="border-[0.5px] border-blue-300 rounded-lg overflow-hidden w-[75%] min-w-[1100px] flex flex-row">
          <div className="border-r-[0.5px] border-r-blue-300 w-[20%]">
            <div className="border-b-[0.5px] border-b-blue-300 flex justify-center">
              <PageNav
                page={page}
                pageSize={10}
                total={openJobCount}
                onSetPage={(page, debounce) => {
                  setPage(page);
                  setDebouncePage(debounce);
                }}
                isLoading={isPlaceholderData || isPending}
                type="jobs"
              />
            </div>
            <div className="h-[calc(100dvh-300px)] min-h-[500px] overflow-y-auto">
              {jobs?.map((job, idx) => (
                <SummaryCard
                  key={job.id}
                  selected={jobId === job.id}
                  onClick={() => setJobId(job.id)}
                  title={job.title}
                  text={
                    <>
                      <div>{job.company?.name}</div>
                    </>
                  }
                  borderBottom={idx < jobs.length - 1}
                />
              ))}
            </div>
          </div>
          <div className="px-4 pt-4 w-[80%] h-[calc(100vh-238px)] overflow-y-auto">
            {jobId && <JobDetails id={jobId} />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Jobs;
