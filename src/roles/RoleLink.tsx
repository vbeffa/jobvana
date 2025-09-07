import { Link } from '@tanstack/react-router';
import type { Role } from '../hooks/types';

export type RoleLinkParams = Pick<Role, 'id' | 'name'>;

const RoleLink = ({ id, name }: RoleLinkParams) => {
  return (
    <Link to="/jobvana/roles/$id" params={{ id: id.toString() }}>
      {name}
    </Link>
  );
};

export default RoleLink;
