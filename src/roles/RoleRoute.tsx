import { Route } from '../routes/jobvana.roles.$id';
import RoleDetails from './RoleDetails';

const RoleRoute = () => {
  const { id } = Route.useLoaderData();

  return (
    <div className="mx-4 flex flex-col gap-2">
      <RoleDetails id={id} />
    </div>
  );
};

export default RoleRoute;
