import { useEffect, useState } from 'react';
import ResourceDetailsContainer from '../../ResourceDetailsContainer';
import ResourceListContainer from '../../ResourceListContainer';
import ResourcesContainer from '../../ResourcesContainer';
import SummaryCard from '../../SummaryCard';
import SummaryCardsContainer from '../../SummaryCardsContainer';
import type { Job } from '../../types';
import MyJob from './MyJob';
import useJobsForCompany from './useJobsForCompany';

const MyJobs = ({ companyId }: { companyId: number }) => {
  const [selectedJob, setSelectedJob] = useState<Job>();
  const { jobs } = useJobsForCompany(companyId);

  useEffect(() => {
    if (jobs && jobs.length > 0) {
      setSelectedJob(jobs[0]);
    }
  }, [jobs]);

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
                text="&nbsp;"
                borderBottom={true}
              />
            ))}
          </SummaryCardsContainer>
        </ResourceListContainer>
        <ResourceDetailsContainer>
          {selectedJob ? (
            <MyJob job={selectedJob} onUpdate={console.log} />
          ) : undefined}
        </ResourceDetailsContainer>
      </ResourcesContainer>
    </>
  );
};

export default MyJobs;
