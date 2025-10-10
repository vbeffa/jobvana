import Select from '../inputs/Select';
import useRoles from '../roles/useRoles';

const RoleSelect = ({
  id,
  roleId,
  width,
  showAny = true,
  showEmpty,
  onChange
}: {
  id: string;
  roleId?: number;
  width?: string;
  showAny?: boolean;
  showEmpty?: boolean;
  onChange: (roleId: number) => void;
}) => {
  if (showAny && showEmpty) {
    throw new Error('cannot set both showAny and showEmpty');
  }
  const { isPending, roles } = useRoles();

  return (
    <Select
      id={id}
      value={roleId}
      width={width}
      onChange={(e) => onChange(parseInt(e.target.value))}
    >
      <>
        {isPending && (
          <option
            key={Number.NEGATIVE_INFINITY}
            value={Number.NEGATIVE_INFINITY}
          >
            Loading...
          </option>
        )}
        {!isPending && (
          <>
            {showAny && (
              <option key={0} value={0}>
                Any
              </option>
            )}
            {showEmpty && <option key={0} value={0} />}
          </>
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
