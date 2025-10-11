import { useEffect, useMemo } from 'react';
import type { InterviewProcess } from '../../companies/company/utils';
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
  const { total, refetch } = useJobApplications({ jobId });

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
    <div className="flex justify-center">
      {total} / {capacity ?? 0}
    </div>
  );
};

export default JobApplications;
