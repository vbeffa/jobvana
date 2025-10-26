import { useMemo, useState } from 'react';
import Modal from '../../Modal';
import PageNav from '../../PageNav';
import type { Paging } from '../../types';
import MyJobsTable from './MarkedJobsTable';
import useMarkedJobs from './useMarkedJobs';

const MyJobs = ({ jobSeekerId }: { jobSeekerId: number }) => {
  const [jobsTab, setJobsTab] = useState<'saved' | 'hidden'>('saved');
  const [savedJobsPage, setSavedJobsPage] = useState(1);
  const [hiddenJobsPage, setHiddenJobsPage] = useState(1);

  const savedJobsPaging: Paging = useMemo(
    () => ({
      page: savedJobsPage,
      pageSize: 10
    }),
    [savedJobsPage]
  );

  const hiddenJobsPaging: Paging = useMemo(
    () => ({
      page: hiddenJobsPage,
      pageSize: 10
    }),
    [hiddenJobsPage]
  );

  const {
    jobs: savedJobs,
    count: savedJobsCount,
    isPending: isSavedJobsPending,
    isPlaceholderData: isSavedJobsPlaceholderData,
    refetch: refetchSavedJobs
  } = useMarkedJobs(jobSeekerId, 'saved', savedJobsPaging);
  const {
    jobs: hiddenJobs,
    count: hiddenJobsCount,
    isPending: isHiddenJobsPending,
    isPlaceholderData: isHiddenJobsPlaceholderData,
    refetch: refetchHiddenJobs
  } = useMarkedJobs(jobSeekerId, 'hidden', hiddenJobsPaging);

  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-row gap-4 w-fit">
        <div
          className={`${jobsTab === 'saved' ? 'border-b-[4px]' : ''} cursor-pointer`}
          onClick={() => {
            if (jobsTab !== 'saved') {
              setJobsTab('saved');
            }
          }}
        >
          Saved ({savedJobsCount ?? '..'})
        </div>
        <div
          className={`${jobsTab === 'hidden' ? 'border-b-[4px]' : ''} cursor-pointer`}
          onClick={() => {
            if (jobsTab !== 'hidden') {
              setJobsTab('hidden');
            }
          }}
        >
          Hidden ({hiddenJobsCount ?? '..'})
        </div>
      </div>
      <div className="h-full">
        {jobsTab === 'saved' && (
          <div className="pt-4 h-full">
            {isSavedJobsPending && <Modal type="loading" />}
            {isSavedJobsPlaceholderData && <Modal type="loading" />}
            {savedJobs?.length ? (
              <div className="h-full flex flex-col justify-between">
                <MyJobsTable
                  jobSeekerId={jobSeekerId}
                  jobs={savedJobs}
                  type="saved"
                  onAction={refetchSavedJobs}
                />
                <PageNav
                  page={savedJobsPage}
                  total={savedJobsCount}
                  onSetPage={(page) => {
                    setSavedJobsPage(page);
                  }}
                  isLoading={isSavedJobsPending || isSavedJobsPlaceholderData}
                  type="saved jobs"
                  borderBottom={false}
                />
              </div>
            ) : !isSavedJobsPending ? (
              <>No saved jobs</>
            ) : null}
          </div>
        )}
        {jobsTab === 'hidden' && (
          <div className="pt-4 h-full">
            {isHiddenJobsPending && <Modal type="loading" />}
            {isHiddenJobsPlaceholderData && <Modal type="loading" />}
            {hiddenJobs?.length ? (
              <div className="h-full flex flex-col justify-between">
                <MyJobsTable
                  jobSeekerId={jobSeekerId}
                  jobs={hiddenJobs}
                  type="hidden"
                  onAction={refetchHiddenJobs}
                />
                <PageNav
                  page={hiddenJobsPage}
                  total={hiddenJobsCount}
                  onSetPage={(page) => {
                    setHiddenJobsPage(page);
                  }}
                  isLoading={isHiddenJobsPending || isHiddenJobsPlaceholderData}
                  type="hidden jobs"
                  borderBottom={false}
                />
              </div>
            ) : !isHiddenJobsPending ? (
              <>No hidden jobs</>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyJobs;
