import { useMemo, useState } from "react";
import { useDebounce } from "use-debounce";
import useJobs, { type JobFilters as JobFiltersT } from "../hooks/useJobs";
import JobFilters from "./JobFilters";
import JobsTable from "./JobsTable";
import PageNav from "./PageNav";

const Jobs = () => {
  const [page, setPage] = useState<number>(1);
  const [companyFilter, setCompanyFilter] = useState<string>("");
  const [titleFilter, setTitleFilter] = useState<string>("");
  const [minSalaryFilter, setMinSalaryFilter] = useState<number>(10000);
  const [maxSalaryFilter, setMaxSalaryFilter] = useState<number>(200000);
  // const [openJobCount, setOpenJobCount] = useState<number>();
  // const [isPlaceholderData, setPlaceholderData] = useState<boolean>();
  const [debouncedCompany] = useDebounce(companyFilter, 1000);
  const [debouncedTitle] = useDebounce(titleFilter, 1000);

  const filters: JobFiltersT = useMemo(
    () => ({ company: debouncedCompany, title: debouncedTitle }),
    [debouncedCompany, debouncedTitle]
  );

  const { jobs, isPlaceholderData, openJobCount } = useJobs({
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
          company={companyFilter}
          onCompanyChange={setCompanyFilter}
          title={titleFilter}
          onTitleChange={setTitleFilter}
          minSalary={minSalaryFilter}
          onMinSalarySelect={setMinSalaryFilter}
          maxSalary={maxSalaryFilter}
          onMaxSalarySelect={setMaxSalaryFilter}
          onSearch={() => {}}
        />
      </div>
      <div className="px-[2em] text-left flex">
        {openJobCount && (
          <PageNav page={page} total={openJobCount} onSetPage={setPage} />
        )}
        {isPlaceholderData && (
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
