import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import supabase from '../utils/supabase';
import type { Database } from '../utils/types';

export type Role = Database['public']['Tables']['roles']['Row'];

export type Roles = {
  roles: Array<Role> | undefined;
  isPending: boolean;
};

const useRoles = (): Roles => {
  const { isPending, data: rolesData } = useQuery({
    queryKey: ['roles'],
    queryFn: async () => {
      const { data } = await supabase.from('roles').select();
      return data;
    }
  });

  const roles = useMemo(
    () =>
      rolesData?.sort((role1, role2) => role1.name.localeCompare(role2.name)),
    [rolesData]
  );

  return {
    roles: roles,
    isPending
  };
};

export default useRoles;
