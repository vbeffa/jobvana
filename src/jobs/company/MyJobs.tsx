import { useEffect, useMemo, useState } from 'react';
import { getSession } from '../../auth/utils';
import ResourceDetailsContainer from '../../containers/ResourceDetailsContainer';
import ResourceListContainer from '../../containers/ResourceListContainer';
import ResourcesContainer from '../../containers/ResourcesContainer';
import SummaryCardsContainer from '../../containers/SummaryCardsContainer';
import Button from '../../controls/Button';
import SummaryCard from '../../SummaryCard';
import UpdatingModal from '../../UpdatingModal';
import { MAX_SALARY, MIN_SALARY } from '../job_seekers/useJobs';
import MyJob from './MyJob';
import useJobsForCompany, { type Job } from './useJobsForCompany';

type JobSummary = Pick<Job, 'id'>;

const MyJobs = ({ companyId }: { companyId: number }) => {
  const [selectedJob, setSelectedJob] = useState<JobSummary>();
  const [updating, setUpdating] = useState(false);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const { jobs, refetch } = useJobsForCompany(companyId);
  const user = getSession()?.user;

  useEffect(() => {
    if (!selectedJob && !isAddingNew && jobs && jobs.length > 0) {
      setSelectedJob(jobs[0]);
    }
  }, [isAddingNew, jobs, selectedJob]);

  const newJob: Job = useMemo(
    () => ({
      id: 0,
      created_at: new Date().toISOString(),
      type: 'full_time',
      company_id: companyId,
      status: 'open',
      title: 'New Job',
      description: '',
      job_roles: [
        {
          job_id: 0,
          role_id: 1,
          percent: 100,
          role_level: 2
        }
      ],
      job_skills: [],
      salary_type: 'annual',
      salary_low: MIN_SALARY,
      salary_high: MAX_SALARY,
      updated_at: new Date().toISOString(),
      user_id: user?.id ?? null
    }),
    [companyId, user?.id]
  );

  const selectedJobDetails = useMemo(
    () =>
      isAddingNew ? newJob : jobs?.find((job) => job.id === selectedJob?.id),
    [isAddingNew, jobs, newJob, selectedJob?.id]
  );

  if (!jobs) {
    return;
  }

  return (
    <>
      <h1>My Jobs</h1>
      <ResourcesContainer minWidth="w-[1100px]" hasFilters={false}>
        <ResourceListContainer>
          <SummaryCardsContainer hasFilters={false}>
            {jobs
              .map((job, idx) => (
                <SummaryCard
                  key={idx}
                  selected={selectedJob?.id === job.id}
                  disabled={isAddingNew}
                  onClick={() => {
                    setSelectedJob(job);
                  }}
                  title={job.title}
                  text={
                    job.updated_at
                      ? `Updated ${new Date(job.updated_at).toLocaleDateString()}`
                      : `Created ${new Date(job.created_at).toLocaleDateString()}`
                  }
                  borderBottom={true}
                />
              ))
              .concat(
                <div key={jobs.length} className="pt-4 flex justify-center">
                  {!isAddingNew && (
                    <Button
                      label="New"
                      onClick={() => {
                        setIsAddingNew(true);
                        setSelectedJob(undefined);
                      }}
                    />
                  )}
                </div>
              )}
          </SummaryCardsContainer>
        </ResourceListContainer>
        <ResourceDetailsContainer>
          <>
            {updating && <UpdatingModal />}
            {selectedJobDetails ? (
              <MyJob
                job={selectedJobDetails}
                isNew={isAddingNew}
                onStartUpdate={() => {
                  setUpdating(true);
                }}
                onFinishUpdate={async (error?: Error) => {
                  if (!error) {
                    await refetch();
                  }
                  setSelectedJob(undefined);
                  setUpdating(false);
                  setIsAddingNew(false);
                }}
                onCancelNewJob={() => {
                  // console.log('pop');
                  // jobs.pop();
                  setSelectedJob(undefined);
                  setIsAddingNew(false);
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
