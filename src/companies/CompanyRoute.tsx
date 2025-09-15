import { Route } from '../routes/jobvana.companies.$id';
import CompanyDetails from './CompanyDetails';

const CompanyRoute = () => {
  const { id } = Route.useLoaderData();

  return (
    <div className="mx-4 flex flex-col gap-2">
      <CompanyDetails id={id} />
    </div>
  );
};

export default CompanyRoute;
