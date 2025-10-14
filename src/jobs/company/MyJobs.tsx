import { useMemo, useState } from 'react';
import { useDebounce } from 'use-debounce';
import ResourceDetailsContainer from '../../containers/ResourceDetailsContainer';
import ResourceListContainer from '../../containers/ResourceListContainer';
import ResourcesContainer from '../../containers/ResourcesContainer';
import SummaryCardsContainer from '../../containers/SummaryCardsContainer';
import type { Company } from '../../Context';
import Button from '../../controls/Button';
import Modal from '../../Modal';
import PageNav from '../../PageNav';
import SummaryCard from '../../SummaryCard';
import JobDetails from './JobDetails';
import useJobs, { type JobsParams } from './useJobs';

const MyJobs = ({ company }: { company: Company }) => {
  const [page, setPage] = useState<number>(1);
  const [debouncePage, setDebouncePage] = useState(false);
  const [debouncedPage] = useDebounce(page, debouncePage ? 500 : 0);
  const [selectedJobId, setSelectedJobId] = useState<number | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);

  const paging: JobsParams['paging'] = useMemo(
    () => ({ page: debouncedPage, pageSize: 10 }),
    [debouncedPage]
  );

  const { jobs, isPlaceholderData, isPending, total, refetch } = useJobs({
    paging,
    filters: { companyId: company.id }
  });

  if (selectedJobId && !jobs?.find((job) => job.id === selectedJobId)) {
    setSelectedJobId(jobs?.[0].id ?? null);
  } else if (!selectedJobId) {
    setSelectedJobId(jobs?.[0].id ?? null);
  }

  const noInterviewProcess = useMemo(
    () => !company.interview_process?.rounds.length,
    [company.interview_process?.rounds.length]
  );

  return (
    <div className="mx-0">
      {isPending && <Modal type="loading" />}
      <ResourcesContainer hasTitle={false} hasFilters={false}>
        <ResourceListContainer>
          <PageNav
            page={page}
            disabled={isAddingNew}
            total={total}
            onSetPage={(page, debounce) => {
              setPage(page);
              setSelectedJobId(null);
              setDebouncePage(debounce);
            }}
            isLoading={isPlaceholderData || isPending}
            type="jobs"
          />
          <SummaryCardsContainer hasFilters={false}>
            {jobs
              ?.map((job, idx) => (
                <SummaryCard
                  key={idx}
                  selected={selectedJobId === job.id}
                  disabled={isAddingNew}
                  onClick={() => {
                    setSelectedJobId(job.id);
                  }}
                  title={job.title}
                  text={`Updated ${new Date(job.updated_at).toLocaleDateString()}`}
                  borderBottom={true}
                />
              ))
              .concat(
                isAddingNew ? (
                  []
                ) : (
                  <div key={jobs.length} className="pt-4 flex justify-center">
                    <div className="flex flex-col justify-center gap-2">
                      <div className="w-full flex justify-center">
                        <Button
                          label="New"
                          disabled={noInterviewProcess}
                          onClick={() => {
                            setIsAddingNew(true);
                            setSelectedJobId(0);
                          }}
                        />
                      </div>
                    </div>
                  </div>
                )
              )}
          </SummaryCardsContainer>
        </ResourceListContainer>
        <ResourceDetailsContainer padding="">
          <>
            {selectedJobId !== null ? (
              <JobDetails
                jobId={selectedJobId}
                company={company}
                isNew={isAddingNew}
                onFinishUpdate={async () => {
                  setIsAddingNew(false);
                  await refetch();
                  setPage(1);
                  setSelectedJobId(null);
                }}
                onCancelNewJob={() => {
                  setIsAddingNew(false);
                }}
              />
            ) : (
              noInterviewProcess && (
                <div className="text-gray-400 flex justify-center pt-4">
                  Please define your interview process before adding jobs.
                </div>
              )
            )}
          </>
        </ResourceDetailsContainer>
      </ResourcesContainer>
    </div>
  );
};

export default MyJobs;
