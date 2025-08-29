import { Link } from '@tanstack/react-router';
import type { Role } from '../hooks/useRoles';

const RoleLink = ({ role }: { role: Role }) => {
  return (
    <Link to="/jobvana/roles/$id" params={{ id: role.id.toString() }}>
      {role.name}
    </Link>
  );
};

export default RoleLink;
