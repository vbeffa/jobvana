import { Route } from '../routes/jobvana.applications.$id';
import ApplicationDetails from './ApplicationDetails';

const Application = () => {
  const { id } = Route.useLoaderData();

  return <ApplicationDetails id={id} />;
};

export default Application;
