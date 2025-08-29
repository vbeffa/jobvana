import { useMemo, useState } from 'react';
import useRoles from '../hooks/useRoles';
import Loading from '../Loading';
import RoleLink from './RoleLink';

type SortCol = 'name';
type SortDir = 'up' | 'down';

const Roles = () => {
  const [sortCol, setSortCol] = useState<SortCol>('name');
  const [sortDir, setSortDir] = useState<SortDir>('up');

  const roles = useRoles();

  const filteredRoles = useMemo(() => {
    return roles.roles?.sort((role1, role2) => {
      return sortDir === 'up'
        ? role1!.name.localeCompare(role2!.name)
        : role2!.name.localeCompare(role1!.name);
    });
  }, [roles.roles, sortDir]);

  const setSort = (col: SortCol) => {
    const newSortCol = col;
    const newSortDir =
      newSortCol === sortCol ? (sortDir === 'up' ? 'down' : 'up') : 'up';
    if (newSortCol === sortCol) {
      setSortDir(newSortDir);
    } else {
      setSortCol(newSortCol);
      setSortDir(newSortDir);
    }
  };

  return (
    <>
      <h1>Roles</h1>
      <div className="card text-center justify-center">
        <table className="w-full">
          <thead>
            <tr>
              <th
                className="p-1 border cursor-pointer w-[25%]"
                onClick={() => setSort('name')}
              >
                Name {sortCol === 'name' && (sortDir === 'up' ? '↑' : '↓')}
              </th>
              <th className="p-1 border">Description</th>
            </tr>
          </thead>
          <tbody>
            <Loading waitingFor={roles.roles} colSpan={1} />
            {filteredRoles?.map((role) => {
              return (
                <tr key={role.id}>
                  <td className="p-1 border text-left align-top">
                    <RoleLink role={role} />
                  </td>
                  <td className="p-1 border text-left align-top">
                    {role.description}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default Roles;
