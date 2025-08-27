import { useMemo, useState } from "react";
import { useDebounce } from "use-debounce";
import useJobs from "../hooks/useJobs";
import JobFilters from "./JobFilters";
import JobsTable from "./JobsTable";
import PageNav from "./PageNav";

export type SearchFilters = {
  company?: string;
  title?: string;
  roleId?: number;
  minSalary?: number;
  maxSalary?: number;
};

const Jobs = () => {
  const [page, setPage] = useState<number>(1);
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({});
  const [debouncedCompany] = useDebounce(searchFilters.company, 1000);
  const [debouncedTitle] = useDebounce(searchFilters.title, 1000);

  const filters: SearchFilters = useMemo(
    () => ({
      company: debouncedCompany,
      title: debouncedTitle,
      roleId: searchFilters.roleId,
      minSalary: searchFilters.minSalary,
      maxSalary: searchFilters.maxSalary
    }),
    [
      debouncedCompany,
      debouncedTitle,
      searchFilters.maxSalary,
      searchFilters.minSalary,
      searchFilters.roleId
    ]
  );

  const { jobs, isPlaceholderData, isPending, openJobCount } = useJobs({
    paging: { page, pageSize: 50 },
    filters
  });
  // const { skills } = useSkills();

  // if (!jobs || !skills) {
  //   return null;
  // }

  return (
    <>
      <h1>Browse Jobs</h1>
      <div className="px-[2em] pb-4 text-left flex">
        <JobFilters
          filters={searchFilters}
          setFilters={setSearchFilters}
          onSearch={() => {}}
        />
      </div>
      <div className="px-[2em] text-left flex">
        {openJobCount && (
          <PageNav page={page} total={openJobCount} onSetPage={setPage} />
        )}
        {(isPlaceholderData || isPending) && (
          <div className="content-center pl-2">Loading...</div>
        )}
      </div>
      <div className="card">
        <JobsTable jobs={jobs} />
      </div>
    </>
  );
};

export default Jobs;
