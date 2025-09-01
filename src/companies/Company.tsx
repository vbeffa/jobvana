import { Route } from '../routes/jobvana.companies.$id';
import CompanyDetails from './CompanyDetails';

const Company = () => {
  const { id } = Route.useLoaderData();

  return <CompanyDetails id={id} />;
};

export default Company;
