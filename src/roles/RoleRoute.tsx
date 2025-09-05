import { Link } from '@tanstack/react-router';
import useRole from '../hooks/useRole';
import JobsForRole from '../jobs/JobsForRole';
import { Route } from '../routes/jobvana.roles.$id';

const RoleRoute = () => {
  const { id } = Route.useLoaderData();
  const { role } = useRole({ id });

  if (!role) {
    return null;
  }

  return (
    <div className="mx-4 flex flex-col gap-2">
      <h1>{role.name}</h1>
      <div className="flex justify-center">
        <div className="my-4 w-[50%] min-w-[1000px]">
          <h2>Description</h2>
          <div>{role.description}</div>
          <h2>Reference</h2>
          <div>
            {role.reference && (
              <Link to={role.reference} target="_blank">
                {role.reference}
              </Link>
            )}
          </div>
          <h2>Jobs</h2>
          <div>
            <JobsForRole role={role} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoleRoute;
