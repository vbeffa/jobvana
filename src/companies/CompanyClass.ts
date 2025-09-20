import type { Company as DbCompany } from '../types';

class CompanyClass {
  private readonly id: number;

  private constructor(company: DbCompany) {
    this.id = company.id;
    console.log(this.id);
  }

  static fromDbCompany(company: DbCompany): CompanyClass {
    return new CompanyClass(company);
  }
}

export default CompanyClass;
