import useRoles from './useRoles';

const useRole = ({ id }: { id: number }) => {
  const { roles } = useRoles();

  return {
    role: roles?.find((role) => role.id === id)
  };
};

export default useRole;
