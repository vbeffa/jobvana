import { useContext } from 'react';
import { getUserType } from '../auth/utils';
import { JobvanaContext } from '../Context';
import { Route } from '../routes/jobvana.companies.$id';
import MyCompany from './company/MyCompany';
import CompanyDetails from './job_seeker/CompanyDetails';

const CompanyRoute = () => {
  const { id } = Route.useLoaderData();
  const userType = getUserType();
  const { company } = useContext(JobvanaContext);

  return (
    <div className="mx-4">
      {userType === 'company' && company && <MyCompany company={company} />}
      {userType === 'job_seeker' && <CompanyDetails id={id} />}
    </div>
  );
};

export default CompanyRoute;
