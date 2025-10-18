import { useEffect, useMemo } from 'react';
import type { InterviewProcess } from '../../companies/company/utils';
import JobvanaError from '../../JobvanaError';
import useJobApplications from './useJobApplications';

export type JobApplicationParams = {
  jobId: number;
  jobInterviewProcess: InterviewProcess | null;
  doRefetch: boolean;
};

const JobApplications = ({
  jobId,
  jobInterviewProcess,
  doRefetch
}: JobApplicationParams) => {
  const { total, isPending, error, refetch } = useJobApplications({ jobId });

  useEffect(() => {
    if (doRefetch) {
      refetch();
    }
  }, [doRefetch, refetch]);

  const capacity = useMemo(
    () => jobInterviewProcess?.pipeline_size,
    [jobInterviewProcess?.pipeline_size]
  );

  return (
    <div className="relative">
      {error && <JobvanaError error={error} />}
      {!error && (
        <>
          {isPending ? '..' : total} / {capacity ?? 0}
        </>
      )}
    </div>
  );
};

export default JobApplications;
