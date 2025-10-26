import ResourceContainer from '../containers/ResourceContainer';
import { Route } from '../routes/jobvana.roles.$id';
import RoleDetails from './RoleDetails';

const RoleRoute = () => {
  const { id } = Route.useLoaderData();

  return (
    <ResourceContainer>
      <RoleDetails id={id} />
    </ResourceContainer>
  );
};

export default RoleRoute;
