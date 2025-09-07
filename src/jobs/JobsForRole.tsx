import { useState } from 'react';
import { useDebounce } from 'use-debounce';
import type { Role } from '../hooks/types';
import useJobs from '../hooks/useJobs';
import PageNav from '../PageNav';
import JobsTable from './JobsTable';

const JobsForRole = ({ role }: { role: Role }) => {
  const [page, setPage] = useState<number>(1);
  const [debouncedPage] = useDebounce(page, 500);
  const { jobs, openJobCount, isPlaceholderData, isPending } = useJobs({
    paging: { page: debouncedPage, pageSize: 10 },
    filters: { roleId: role.id }
  });

  return (
    <>
      <div className="pb-4">
        <PageNav
          page={page}
          total={openJobCount}
          onSetPage={setPage}
          isLoading={isPlaceholderData || isPending}
          type="jobs"
          borderBottom={false}
        />
      </div>
      <div>
        <JobsTable jobs={jobs} />
      </div>
    </>
  );
};

export default JobsForRole;
