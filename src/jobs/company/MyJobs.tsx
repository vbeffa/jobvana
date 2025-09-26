import { useEffect, useState } from 'react';
import { FaPlus } from 'react-icons/fa6';
import ResourceDetailsContainer from '../../containers/ResourceDetailsContainer';
import ResourceListContainer from '../../containers/ResourceListContainer';
import ResourcesContainer from '../../containers/ResourcesContainer';
import SummaryCardsContainer from '../../containers/SummaryCardsContainer';
import SummaryCard from '../../SummaryCard';
import UpdatingModal from '../../UpdatingModal';
import { MAX_SALARY, MIN_SALARY } from '../useJobs';
import MyJob from './MyJob';
import useJobsForCompany, { type Job } from './useJobsForCompany';

export type Edit = {
  jobId?: number;
  section?: 'main' | 'roles' | 'skills';
};

const MyJobs = ({ companyId }: { companyId: number }) => {
  const [selectedJob, setSelectedJob] = useState<Job>();
  const [updating, setUpdating] = useState(false);
  const [edit, setEdit] = useState<Edit>({});
  const { jobs, refetch } = useJobsForCompany(companyId);

  useEffect(() => {
    if (!selectedJob && jobs && jobs.length > 0) {
      setSelectedJob(jobs[0]);
    }
  }, [jobs, selectedJob]);

  const newJob: Job = {
    id: 0,
    created_at: new Date().toISOString(),
    company_id: companyId,
    status: 'open',
    title: 'New Job',
    description: '',
    job_roles: [],
    job_skills: [],
    salary_low: MIN_SALARY,
    salary_high: MAX_SALARY,
    updated_at: null,
    user_id: ''
  };

  if (!jobs) {
    return;
  }

  return (
    <>
      <h1>My Jobs</h1>
      <ResourcesContainer minWidth="w-[1100px]" hasFilters={false}>
        <ResourceListContainer>
          <SummaryCardsContainer>
            {jobs
              .map((job, idx) => (
                <SummaryCard
                  key={idx}
                  selected={selectedJob?.id === job.id}
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
                <div
                  key={jobs.length}
                  className="flex pt-2 pl-2 cursor-pointer"
                  onClick={() => {
                    jobs.push(newJob);
                    setSelectedJob(newJob);
                  }}
                >
                  <FaPlus />
                </div>
              )}
          </SummaryCardsContainer>
        </ResourceListContainer>
        <ResourceDetailsContainer>
          <>
            {updating && <UpdatingModal />}
            {selectedJob ? (
              <MyJob
                job={selectedJob}
                onStartUpdate={() => {
                  setUpdating(true);
                }}
                onFinishUpdate={async () => {
                  await refetch();
                  setUpdating(false);
                  setSelectedJob(undefined);
                }}
                edit={edit}
                setEdit={setEdit}
              />
            ) : undefined}
          </>
        </ResourceDetailsContainer>
      </ResourcesContainer>
    </>
  );
};

export default MyJobs;
