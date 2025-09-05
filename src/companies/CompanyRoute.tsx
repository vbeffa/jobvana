import { Route } from '../routes/jobvana.companies.$id';
import CompanyDetails from './CompanyDetails';

const CompanyRoute = () => {
  const { id } = Route.useLoaderData();

  return <CompanyDetails id={id} />;
};

export default CompanyRoute;
