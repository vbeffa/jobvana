import { useMemo } from 'react';
import type { Company } from './useApplications';
import useCompanyApplications from './useCompanyApplications';

export type CompanyApplicationParams = Pick<
  Company,
  'id' | 'interview_process'
>;

const CompanyApplications = ({
  id,
  interview_process
}: CompanyApplicationParams) => {
  const { total } = useCompanyApplications(id);

  const capacity = useMemo(
    () => interview_process?.pipeline_size,
    [interview_process?.pipeline_size]
  );

  return (
    <div className="flex justify-center">
      {total} / {capacity ?? 0}
    </div>
  );
};

export default CompanyApplications;
