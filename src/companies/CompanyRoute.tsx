import { useContext } from 'react';
import { getUserType } from '../auth/utils';
import { JobvanaContext } from '../Context';
import { Route } from '../routes/jobvana.companies.$id';
import CompanyDetails from './CompanyDetails';
import ShowEditCompany from './ShowEditCompany';

const CompanyRoute = () => {
  const { id } = Route.useLoaderData();
  const userType = getUserType();
  const { company } = useContext(JobvanaContext);

  return (
    <div className="mx-4 flex flex-col gap-2">
      {userType === 'company' && company && (
        <ShowEditCompany company={company} />
      )}
      {userType === 'job_seeker' && <CompanyDetails id={id} />}
    </div>
  );
};

export default CompanyRoute;
