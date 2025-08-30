import { useState } from 'react';
import type { Company } from '../hooks/useCompanies';
import useJobs from '../hooks/useJobs';
import JobsTable from './JobsTable';
import PageNav from '../PageNav';
import { useDebounce } from 'use-debounce';

const JobsForCompany = ({ company }: { company: Company }) => {
  const [page, setPage] = useState<number>(1);
  const [debouncedPage] = useDebounce(page, 500);
  const { jobs, openJobCount, isPlaceholderData, isPending } = useJobs({
    paging: { page: debouncedPage, pageSize: 50 },
    filters: { companyId: company.id }
  });

  return (
    <>
      <div className="pb-[2em]">
        <PageNav
          page={page}
          total={openJobCount}
          onSetPage={setPage}
          isLoading={isPlaceholderData || isPending}
        />
      </div>
      <div>
        <JobsTable jobs={jobs} />
      </div>
    </>
  );
};

export default JobsForCompany;
