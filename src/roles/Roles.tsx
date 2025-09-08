import { useEffect, useState } from 'react';
import Error from '../Error';
import useRoles from '../hooks/useRoles';
import ResourceDetailsContainer from '../ResourceDetailsContainer';
import ResourceListContainer from '../ResourceListContainer';
import ResourcesContainer from '../ResourcesContainer';
import SummaryCard from '../SummaryCard';
import SummaryCardsContainer from '../SummaryCardsContainer';
import RoleDetails from './RoleDetails';

const Roles = () => {
  const { roles, error } = useRoles();
  const [roleId, setRoleId] = useState<number | null>(null);

  useEffect(() => {
    setRoleId(roles?.[0].id ?? null);
  }, [roles]);

  return (
    <div className="mx-4">
      {error && <Error error={error} />}
      <h1>Roles</h1>
      <div className="h-4" />
      <ResourcesContainer>
        <ResourceListContainer>
          <SummaryCardsContainer hasFilters={false}>
            {roles?.map((role, idx) => {
              return (
                <SummaryCard
                  key={role.id}
                  selected={roleId === role.id}
                  onClick={() => setRoleId(role.id)}
                  title={role.name}
                  text={
                    <>
                      <div>{role.name}</div>
                    </>
                  }
                  borderBottom={idx < roles.length - 1}
                />
              );
            })}
          </SummaryCardsContainer>
        </ResourceListContainer>
        <ResourceDetailsContainer hasFilters={false}>
          {roleId ? <RoleDetails id={roleId} /> : undefined}
        </ResourceDetailsContainer>
      </ResourcesContainer>
    </div>
  );
};

export default Roles;
