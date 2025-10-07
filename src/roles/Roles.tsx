import { useEffect, useState } from 'react';
import JobvanaError from '../JobvanaError';
import SummaryCard from '../SummaryCard';
import ResourceDetailsContainer from '../containers/ResourceDetailsContainer';
import ResourceListContainer from '../containers/ResourceListContainer';
import ResourcesContainer from '../containers/ResourcesContainer';
import SummaryCardsContainer from '../containers/SummaryCardsContainer';
import RoleDetails from './RoleDetails';
import useRoles from './useRoles';

const Roles = () => {
  const { roles, error } = useRoles();
  const [roleId, setRoleId] = useState<number | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setRoleId(roles?.[0].id ?? null);
  }, [roles]);

  return (
    <div className="mx-4">
      {error && <JobvanaError error={error} />}
      <h1>Roles</h1>
      <ResourcesContainer hasFilters={false}>
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
        <ResourceDetailsContainer>
          {roleId ? <RoleDetails id={roleId} /> : undefined}
        </ResourceDetailsContainer>
      </ResourcesContainer>
    </div>
  );
};

export default Roles;
