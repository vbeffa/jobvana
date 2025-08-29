import { Link } from '@tanstack/react-router';
import useRole from '../hooks/useRole';
import JobsForRole from '../jobs/JobsForRole';
import { Route } from '../routes/jobvana.roles.$id';

const Role = () => {
  const { id } = Route.useLoaderData();
  const { role } = useRole({ id });

  if (!role) {
    return null;
  }

  return (
    <>
      <h1>{role.name}</h1>
      <h2>Description</h2>
      <div className="card text-left">{role.description}</div>
      <h2>Reference</h2>
      <div className="card text-left">
        {role.reference && (
          <Link to={role.reference} target="_blank">
            {role.reference}
          </Link>
        )}
      </div>
      <h2>Jobs</h2>
      <div className="card text-left">
        <JobsForRole role={role} />
      </div>
    </>
  );
};

export default Role;
