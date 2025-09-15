import { Link } from '@tanstack/react-router';
import Section from '../Section';
import useRole from './useRole';

const RoleDetails = ({ id }: { id: number }) => {
  const { role } = useRole({ id });

  if (!role) {
    return null;
  }

  return (
    <>
      <Section height={24} title={role.name}>
        {role.description}
      </Section>
      <Section title="Reference" isLast={true}>
        {role.reference && (
          <Link to={role.reference} target="_blank">
            {role.reference}
          </Link>
        )}
      </Section>
    </>
  );
};

export default RoleDetails;
