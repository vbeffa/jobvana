import { Link } from '@tanstack/react-router';
import useRole from './useRole';

const RoleDetails = ({ id }: { id: number }) => {
  const { role } = useRole({ id });

  if (!role) {
    return null;
  }

  return (
    <div className="mx-4 flex flex-col gap-2">
      <h2>{role.name}</h2>
      <div>{role.description}</div>
      <hr className="my-4 border-gray-400 shadow" />
      <h2>Reference</h2>
      <div>
        {role.reference && (
          <Link to={role.reference} target="_blank">
            {role.reference}
          </Link>
        )}
      </div>
    </div>
  );
};

export default RoleDetails;
