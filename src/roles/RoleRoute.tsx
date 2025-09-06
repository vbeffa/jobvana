import { Route } from '../routes/jobvana.roles.$id';
import RoleDetails from './RoleDetails';

const RoleRoute = () => {
  const { id } = Route.useLoaderData();

  return <RoleDetails id={id} />;
};

export default RoleRoute;
