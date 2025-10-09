import { useQuery } from '@tanstack/react-query';
import supabase from '../../db/supabase';

export type CompanyApplications = {
  total: number | undefined;
};

const useCompanyApplications = (companyId: number): CompanyApplications => {
  const { data } = useQuery({
    queryKey: ['company_applications', companyId],
    queryFn: async () => {
      const { data } = await supabase
        .from('company_applications')
        .select('*')
        .filter('company_id', 'eq', companyId);
      // console.log(data);
      return data;
    }
  });

  return {
    total: data?.[0].num_applications ?? undefined
  };
};

export default useCompanyApplications;
