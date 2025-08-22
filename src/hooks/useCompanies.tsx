import { useEffect, useState } from "react";
import supabase from "../utils/supabase";
import type { Database } from "../utils/types";

export type Company = Database["public"]["Tables"]["companies"]["Row"];

export type CompaniesQ = {
  all: Array<Company>;
  company: (id: number) => Company | undefined;
};

const useCompanies = (): CompaniesQ => {
  const [companies, setCompanies] = useState<Array<Company>>([]);

  useEffect(() => {
    if (companies.length > 0) {
      return;
    }
    (async () => {
      const { data: companies } = await supabase.from("companies").select();
      if (companies === null) {
        return;
      }
      setCompanies(
        companies.sort((company1, company2) =>
          company1.name.localeCompare(company2.name)
        )
      );
    })();
  }, [companies.length]);

  return {
    all: companies,
    company: (id: number) => {
      return companies.find((company) => company.id === id);
    }
  };
};

export default useCompanies;
