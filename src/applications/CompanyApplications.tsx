import { useMemo } from 'react';
import useApplicationsForCompany from './useApplicationsForCompany';
import type { Application } from './useApplicationsForJobSeeker';

export type CompanyApplicationParams = {
  application: Application;
};

const CompanyApplications = ({ application }: CompanyApplicationParams) => {
  const { total } = useApplicationsForCompany(application.company.id);

  const capacity = useMemo(
    () => application.company.interview_process?.pipeline_size,
    [application.company.interview_process?.pipeline_size]
  );

  return (
    <div className="flex justify-center">
      {total} / {capacity ?? 0}
    </div>
  );
};

export default CompanyApplications;
