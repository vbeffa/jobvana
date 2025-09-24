import { useEffect, useState } from 'react';
import ResourceDetailsContainer from '../../containers/ResourceDetailsContainer';
import ResourceListContainer from '../../containers/ResourceListContainer';
import ResourcesContainer from '../../containers/ResourcesContainer';
import SummaryCardsContainer from '../../containers/SummaryCardsContainer';
import SummaryCard from '../../SummaryCard';
import UpdatingModal from '../../UpdatingModal';
import MyJob from './MyJob';
import useJobsForCompany, { type Job } from './useJobsForCompany';

const MyJobs = ({ companyId }: { companyId: number }) => {
  const [selectedJob, setSelectedJob] = useState<Job>();
  const [updating, setUpdating] = useState(false);
  const { jobs, refetch } = useJobsForCompany(companyId);

  useEffect(() => {
    if (!selectedJob && jobs && jobs.length > 0) {
      setSelectedJob(jobs[0]);
    }
  }, [jobs, selectedJob]);

  return (
    <>
      <h1>My Jobs</h1>
      <ResourcesContainer minWidth="min-w-[1100px]" hasFilters={false}>
        <ResourceListContainer>
          <SummaryCardsContainer>
            {jobs?.map((job, idx) => (
              <SummaryCard
                key={idx}
                selected={selectedJob?.id === job.id}
                onClick={() => setSelectedJob(job)}
                title={job.title}
                text={
                  job.updated_at
                    ? `Updated ${new Date(job.updated_at).toLocaleDateString()}`
                    : `Created ${new Date(job.created_at).toLocaleDateString()}`
                }
                borderBottom={true}
              />
            ))}
          </SummaryCardsContainer>
        </ResourceListContainer>
        <ResourceDetailsContainer>
          <>
            {updating && <UpdatingModal />}
            {selectedJob ? (
              <MyJob
                job={selectedJob}
                onUpdate={async () => {
                  setUpdating(true);
                  await refetch();
                  setUpdating(false);
                  setSelectedJob(undefined);
                }}
              />
            ) : undefined}
          </>
        </ResourceDetailsContainer>
      </ResourcesContainer>
    </>
  );
};

export default MyJobs;
