import { useMemo, useState } from 'react';
import useCompanyAddresses from '../../companies/company/useCompanyAddresses';
import ResourceDetailsContainer from '../../containers/ResourceDetailsContainer';
import ResourceListContainer from '../../containers/ResourceListContainer';
import ResourcesContainer from '../../containers/ResourcesContainer';
import SummaryCardsContainer from '../../containers/SummaryCardsContainer';
import type { Company } from '../../Context';
import Button from '../../controls/Button';
import Modal from '../../Modal';
import SummaryCard from '../../SummaryCard';
import { MAX_SALARY, MIN_SALARY } from '../job_seekers/useJobs';
import MyJob from './MyJob';
import useJobsForCompany, { type Job } from './useJobsForCompany';

type JobSummary = Pick<Job, 'id'>;

const MyJobs = ({ company }: { company: Company }) => {
  const [selectedJob, setSelectedJob] = useState<JobSummary>();
  const [updating, setUpdating] = useState(false);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const { jobs, refetch } = useJobsForCompany({ companyId: company.id });
  const { addresses } = useCompanyAddresses(company.id);

  if (!selectedJob && !isAddingNew && jobs && jobs.length > 0) {
    setSelectedJob(jobs[0]);
  }

  const newJob: Job = useMemo(
    () => ({
      id: 0,
      created_at: new Date().toISOString(),
      type: 'full_time',
      company_id: company.id,
      status: 'draft',
      title: 'New Job',
      description: '',
      job_roles: [
        {
          job_id: 0,
          role_id: 0,
          percent: 100,
          role_level: 2
        }
      ],
      job_skills: [],
      salary_type: 'annual',
      salary_low: MIN_SALARY,
      salary_high: MAX_SALARY,
      updated_at: new Date().toISOString(),
      company_address_id: null,
      interview_process: company.interview_process
    }),
    [company]
  );

  const selectedJobDetails = useMemo(
    () =>
      isAddingNew ? newJob : jobs?.find((job) => job.id === selectedJob?.id),
    [isAddingNew, jobs, newJob, selectedJob?.id]
  );

  const noInterviewProcess = useMemo(
    () => !company.interview_process?.rounds.length,
    [company.interview_process?.rounds.length]
  );

  if (!jobs) {
    return;
  }

  return (
    <div className="mx-0">
      <ResourcesContainer hasTitle={false} hasFilters={false}>
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
                            setSelectedJob(undefined);
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
            {updating && (
              <>
                {isAddingNew ? (
                  <Modal type="saving" />
                ) : (
                  <Modal type="updating" />
                )}
              </>
            )}
            {selectedJobDetails ? (
              <MyJob
                job={selectedJobDetails}
                isNew={isAddingNew}
                addresses={addresses ?? []}
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
