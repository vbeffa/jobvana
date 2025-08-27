import useRoles from "../hooks/useRoles";

const RoleSelect = ({
  id,
  roleId,
  onChange
}: {
  id: string;
  roleId?: number;
  onChange: (roleId: number) => void;
}) => {
  const { roles } = useRoles();

  if (!roles) {
    return null;
  }

  return (
    <select
      id={id}
      className="border border-gray-500 rounded-sm h-8 px-2 py-0.5"
      value={roleId}
      onChange={(e) => onChange(parseInt(e.target.value))}
    >
      <option key={0} value=""></option>
      {roles.map((role, idx) => (
        <option key={idx} value={role.id}>
          {role.name}
        </option>
      ))}
    </select>
  );
};

export default RoleSelect;
