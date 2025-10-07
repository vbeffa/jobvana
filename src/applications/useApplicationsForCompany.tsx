import { useQuery } from '@tanstack/react-query';
import supabase from '../db/supabase';

export type Applications = {
  total: number | undefined;
};

const useApplicationsForCompany = (companyId: number): Applications => {
  const { data } = useQuery({
    queryKey: ['company_applications', companyId],
    queryFn: async () => {
      const { data } = await supabase
        .from('company_applications')
        .select('*')
        .filter('company_id', 'eq', companyId);
      console.log(data);
      return data;
    }
  });

  return {
    total: data?.[0].num_applications ?? undefined
  };
};

export default useApplicationsForCompany;
