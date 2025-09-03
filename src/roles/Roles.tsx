import { useMemo, useState } from 'react';
import useRoles from '../hooks/useRoles';
import Loading from '../Loading';
import RoleLink from './RoleLink';

type SortCol = 'name';
type SortDir = 'up' | 'down';

const Roles = () => {
  const [sortCol, setSortCol] = useState<SortCol>('name');
  const [sortDir, setSortDir] = useState<SortDir>('up');

  const { roles } = useRoles();

  const filteredRoles = useMemo(() => {
    return roles?.sort((role1, role2) => {
      return sortDir === 'up'
        ? role1!.name.localeCompare(role2!.name)
        : role2!.name.localeCompare(role1!.name);
    });
  }, [roles, sortDir]);

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
      <div className="">
        <table className="w-full">
          <thead>
            <tr>
              <th
                className="cursor-pointer w-[25%]"
                onClick={() => setSort('name')}
              >
                Name {sortCol === 'name' && (sortDir === 'up' ? '↑' : '↓')}
              </th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            <Loading waitingFor={roles} colSpan={2} />
            {filteredRoles?.map((role) => {
              return (
                <tr key={role.id}>
                  <td>
                    <RoleLink role={role} />
                  </td>
                  <td>{role.description}</td>
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
