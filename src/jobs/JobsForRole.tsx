import { useState } from 'react';
import type { Role } from '../hooks/useRoles';
import useJobs from '../hooks/useJobs';
import JobsTable from './JobsTable';
import PageNav from '../PageNav';
import { useDebounce } from 'use-debounce';

const JobsForRole = ({ role }: { role: Role }) => {
  const [page, setPage] = useState<number>(1);
  const [debouncedPage] = useDebounce(page, 500);
  const { jobs, openJobCount, isPlaceholderData, isPending } = useJobs({
    paging: { page: debouncedPage, pageSize: 50 },
    filters: { roleId: role.id }
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

export default JobsForRole;
