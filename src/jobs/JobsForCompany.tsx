import { useState } from 'react';
import type { Company } from '../hooks/useCompanies';
import useJobs from '../hooks/useJobs';
import JobsTable from './JobsTable';
import PageNav from '../PageNav';

const JobsForCompany = ({ company }: { company: Company }) => {
  const [page, setPage] = useState<number>(1);
  const { jobs, openJobCount, isPlaceholderData, isPending } = useJobs({
    paging: { page: 1, pageSize: 50 },
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
