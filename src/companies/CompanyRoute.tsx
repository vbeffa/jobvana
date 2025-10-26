import { useContext } from 'react';
import { getUserType } from '../auth/utils';
import ResourceContainer from '../containers/ResourceContainer';
import { CompanyContext } from '../Context';
import { Route } from '../routes/jobvana.companies.$id';
import MyCompany from './company/MyCompany';
import CompanyDetails from './job_seeker/CompanyDetails';

const CompanyRoute = () => {
  const { id } = Route.useLoaderData();
  const userType = getUserType();
  const { company } = useContext(CompanyContext);

  // companies can only view their own companies
  if (userType === 'company' && company?.id !== id) {
    return null;
  }

  return (
    <>
      {userType === 'company' && company && <MyCompany company={company} />}
      {userType === 'job_seeker' && (
        <ResourceContainer>
          <CompanyDetails id={id} />
        </ResourceContainer>
      )}
    </>
  );
};

export default CompanyRoute;
