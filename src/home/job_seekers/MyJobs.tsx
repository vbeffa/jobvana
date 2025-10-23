import { useMemo, useState } from 'react';
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
    isPending: isSavedJobsPending,
    isPlaceholderData: isSavedJobsPlaceholderData,
    refetch: refetchSavedJobs
  } = useMarkedJobs(jobSeekerId, 'saved', savedJobsPaging);
  const {
    jobs: hiddenJobs,
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
          Saved Jobs
        </div>
        <div
          className={`${jobsTab === 'hidden' ? 'border-b-[4px]' : ''} cursor-pointer`}
          onClick={() => {
            if (jobsTab !== 'hidden') {
              setJobsTab('hidden');
            }
          }}
        >
          Hidden Jobs
        </div>
      </div>
      <div className="h-full">
        {jobsTab === 'saved' && (
          <div className="pt-4 h-full">
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
                  total={11}
                  onSetPage={(page) => {
                    setSavedJobsPage(page);
                  }}
                  isLoading={isSavedJobsPending || isSavedJobsPlaceholderData}
                  type="saved jobs"
                  borderBottom={false}
                />
              </div>
            ) : (
              <>No saved jobs</>
            )}
          </div>
        )}
        {jobsTab === 'hidden' && (
          <div className="pt-4 h-full">
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
                  total={11}
                  onSetPage={(page) => {
                    setHiddenJobsPage(page);
                  }}
                  isLoading={isHiddenJobsPending || isHiddenJobsPlaceholderData}
                  type="hidden jobs"
                  borderBottom={false}
                />
              </div>
            ) : (
              <>No hidden jobs</>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyJobs;
