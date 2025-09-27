import Select from '../inputs/Select';
import useRoles from '../roles/useRoles';

const RoleSelect = ({
  id,
  roleId,
  showAny = true,
  onChange
}: {
  id: string;
  roleId?: number;
  showAny?: boolean;
  onChange: (roleId: number) => void;
}) => {
  const { isPending, roles } = useRoles();

  return (
    <Select
      id={id}
      value={roleId}
      onChange={(e) => onChange(parseInt(e.target.value))}
    >
      <>
        {isPending && (
          <option key={0} value={Number.NEGATIVE_INFINITY}>
            Loading...
          </option>
        )}
        {!isPending && showAny && (
          <option key={0} value={0}>
            Any
          </option>
        )}
        {roles?.map((role, idx) => (
          <option key={idx} value={role.id}>
            {role.name}
          </option>
        ))}
      </>
    </Select>
  );
};

export default RoleSelect;
