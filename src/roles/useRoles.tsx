import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import supabase from '../db/supabase';
import type { Role } from '../types';

export type Roles = {
  roles: Array<Role> | undefined;
  isPending: boolean;
  error?: Error;
  findRole: (roleId: number) => Role | undefined;
};

// roles are few - no paging needed
const useRoles = (): Roles => {
  const {
    isPending,
    data: rolesData,
    error
  } = useQuery({
    queryKey: ['roles'],
    queryFn: async () => {
      const { error, data } = await supabase.from('roles').select();
      return { error, data };
    }
  });

  const roles = useMemo(
    () =>
      rolesData?.data?.sort((role1, role2) =>
        role1.name.localeCompare(role2.name)
      ),
    [rolesData]
  );

  return {
    roles,
    isPending,
    error: error ?? undefined,
    findRole: (roleId: number) => roles?.find((role) => role.id === roleId)
  };
};

export default useRoles;
