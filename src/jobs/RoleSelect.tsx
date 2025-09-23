import useRoles from '../roles/useRoles';

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
      className="border-[0.5px] border-gray-500 h-8 py-0.5"
      value={roleId}
      onChange={(e) => onChange(parseInt(e.target.value))}
    >
      {isPending && (
        <option key={0} value={Number.NEGATIVE_INFINITY}>
          Loading...
        </option>
      )}
      {!isPending && (
        <option key={0} value={0}>
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
