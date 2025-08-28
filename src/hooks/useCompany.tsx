import useCompanies from './useCompanies';

const useCompany = ({ id }: { id: number }) => {
  const { companies } = useCompanies();

  return {
    company: companies?.find((company) => company.id === id)
  };
};

export default useCompany;
