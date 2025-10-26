import { Link } from '@tanstack/react-router';
import Section from '../Section';
import useRole from './useRole';

const RoleDetails = ({ id }: { id: number }) => {
  const { role } = useRole({ id });

  if (!role) {
    return null;
  }

  return (
    <div className="px-4 mt-2">
      <Section title={role.name}>{role.description}</Section>
      <Section title="Reference" isLast={true}>
        {role.reference && (
          <Link to={role.reference} target="_blank">
            {role.reference}
          </Link>
        )}
      </Section>
    </div>
  );
};

export default RoleDetails;
