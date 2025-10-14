import { useMemo, useState } from 'react';
import useCompanyAddresses from '../../companies/company/useCompanyAddresses';
import type { Company } from '../../Context';
import Modal from '../../Modal';
import { MAX_SALARY, MIN_SALARY } from '../job_seekers/useJobs';
import MyJob from './MyJob';
import useJob, { type Job } from './useJob';

const JobDetails = ({
  company,
  jobId,
  isNew = false,
  onFinishUpdate,
  onCancelNewJob
}: {
  company: Company;
  jobId: number;
  isNew?: boolean;
  onFinishUpdate?: () => Promise<void>;
  onCancelNewJob?: () => void;
}) => {
  const { job, isPlaceholderData, isPending, refetch } = useJob(jobId);
  const { addresses } = useCompanyAddresses(company.id);
  const [updating, setUpdating] = useState(false);

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

  const myJob = isNew ? newJob : job;

  if (!myJob) {
    return isPending ? (
      <Modal type="loading" />
    ) : (
      <div className="flex justify-center">Not found</div>
    );
  }

  return (
    <div>
      {isPlaceholderData && !isNew && <Modal type="loading" />}
      {updating && <Modal type={isNew ? 'saving' : 'updating'} />}
      <MyJob
        job={myJob}
        isNew={isNew}
        addresses={addresses ?? []}
        onStartUpdate={() => {
          setUpdating(true);
        }}
        onFinishUpdate={async () => {
          if (onFinishUpdate) {
            await onFinishUpdate();
          }
          await refetch();
          setUpdating(false);
        }}
        onCancelNewJob={() => onCancelNewJob && onCancelNewJob()}
      />
    </div>
  );
};

export default JobDetails;
