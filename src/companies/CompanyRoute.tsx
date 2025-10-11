import { useContext } from 'react';
import { getUserType } from '../auth/utils';
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
        <div className="flex justify-center mb-4">
          <div className="border-[0.5px] border-blue-400 rounded-lg overflow-hidden w-[75%]">
            <div className="px-4 pt-2">
              <CompanyDetails id={id} />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CompanyRoute;
