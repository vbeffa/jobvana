import { useMemo, useState } from 'react';
import { type CompanySummary } from '../hooks/useCompanies';
import CompanyLink from './CompanyLink';
import { findHeadquarters } from './companiesUtil';

type SortCol = 'company' | 'num_employees';
type SortDir = 'up' | 'down';

const CompaniesTable = ({
  companies
}: {
  companies?: Array<CompanySummary>;
}) => {
  const [sortCol, setSortCol] = useState<SortCol>('company');
  const [sortDir, setSortDir] = useState<SortDir>('up');

  const sortedCompanies = useMemo(() => {
    return companies?.sort((company1, company2) => {
      if (sortCol === 'company') {
        return sortDir === 'up'
          ? company1!.name.localeCompare(company2!.name)
          : company2!.name.localeCompare(company1!.name);
      }
      return sortDir === 'down'
        ? company2.num_employees - company1.num_employees
        : company1.num_employees - company2.num_employees;
    });
  }, [companies, sortCol, sortDir]);

  const setSort = (col: SortCol) => {
    const newSortCol = col;
    const newSortDir =
      newSortCol === sortCol ? (sortDir === 'up' ? 'down' : 'up') : 'up';
    if (newSortCol === sortCol) {
      setSortDir(newSortDir);
    } else {
      setSortCol(newSortCol);
      setSortDir(newSortDir);
    }
  };

  if (!sortedCompanies) {
    return null;
  }

  return (
    <table className="w-full">
      <thead>
        <tr>
          <th
            className="cursor-pointer w-[50%]"
            onClick={() => setSort('company')}
          >
            Name {sortCol === 'company' && (sortDir === 'up' ? '↑' : '↓')}
          </th>
          <th className="w-[20%]">Industry</th>
          <th className="w-[10%]">Headquarters</th>
          <th className="w-[10%]">Num Offices</th>
          <th
            className="cursor-pointer"
            onClick={() => setSort('num_employees')}
          >
            Size {sortCol === 'num_employees' && (sortDir === 'up' ? '↑' : '↓')}
          </th>
        </tr>
      </thead>
      <tbody>
        {/* <Loading waitingFor={companies} colSpan={1} /> */}
        {sortedCompanies.length === 0 && (
          <tr key={0}>
            <td className="text-center" colSpan={6}>
              No companies found
            </td>
          </tr>
        )}
        {sortedCompanies.map((company) => {
          return (
            <tr key={company.id}>
              <td>
                <CompanyLink {...company} />
              </td>
              <td>{company.industry.name}</td>
              <td>{findHeadquarters(company)?.state}</td>
              <td>{company.addresses.length}</td>
              <td>{company.num_employees}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default CompaniesTable;
