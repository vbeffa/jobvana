import { useState } from 'react';
import useCompanyAddresses from '../../companies/company/useCompanyAddresses';
import type { Company } from '../../Context';
import Modal from '../../Modal';
import MyJob from './MyJob';
import useJobsForCompany from './useJobsForCompany';

const JobDetails = ({
  company,
  jobId
}: {
  company: Company;
  jobId: number;
}) => {
  const { jobs, refetch } = useJobsForCompany({ companyId: company.id, jobId });
  const { addresses } = useCompanyAddresses(company.id);
  const [updating, setUpdating] = useState(false);

  const job = jobs?.find((job) => job.id === jobId);

  if (!job) {
    return null;
  }

  return (
    <div>
      {updating && <Modal type="updating" />}
      <MyJob
        company={company}
        job={job}
        isNew={false}
        addresses={addresses ?? []}
        onStartUpdate={() => {
          setUpdating(true);
        }}
        onFinishUpdate={async (error?: Error) => {
          if (!error) {
            await refetch();
          }
          setUpdating(false);
        }}
        onCancelNewJob={() => {}}
      />
    </div>
  );
};

export default JobDetails;
