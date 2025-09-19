import type { Company as DbCompany } from '../types';

class Company {
  private readonly id: number;

  private constructor(company: DbCompany) {
    this.id = company.id;
    console.log(this.id);
  }

  static fromDbCompany(company: DbCompany): Company {
    return new Company(company);
  }
}

export default Company;
