import useRoles from '../hooks/useRoles';

const RoleSelect = ({
  id,
  roleId,
  onChange
}: {
  id: string;
  roleId?: number;
  onChange: (roleId: number) => void;
}) => {
  const { isPending, roles } = useRoles();

  return (
    <select
      id={id}
      className="border border-gray-500 rounded-lg h-8 w-60 px-2 py-0.5"
      value={roleId}
      onChange={(e) => onChange(parseInt(e.target.value))}
    >
      {isPending && (
        <option key={0} value="0">
          Loading...
        </option>
      )}
      {!isPending && (
        <option key={0} value="0">
          Any
        </option>
      )}
      {roles?.map((role, idx) => (
        <option key={idx} value={role.id}>
          {role.name}
        </option>
      ))}
    </select>
  );
};

export default RoleSelect;
