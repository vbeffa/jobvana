import { useMemo, useState } from 'react';
import { type Company } from '../hooks/useCompanies';
import CompanyLink from './CompanyLink';

type SortCol = 'company' | 'num_employees';
type SortDir = 'up' | 'down';

const CompaniesTable = ({ companies }: { companies?: Array<Company> }) => {
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
            className="p-1 border cursor-pointer w-[70%]"
            onClick={() => setSort('company')}
          >
            Name {sortCol === 'company' && (sortDir === 'up' ? '↑' : '↓')}
          </th>
          <th className="p-1 border w-[20%]">Location</th>
          <th
            className="p-1 border cursor-pointer"
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
            <td className="p-2 border-[0.05rem] text-center" colSpan={6}>
              No companies found
            </td>
          </tr>
        )}
        {sortedCompanies.map((company) => {
          return (
            <tr key={company.id}>
              <td className="p-1 border text-left align-top">
                <CompanyLink company={company} />
              </td>
              <td className="p-1 border text-left align-top">
                {company.location}
              </td>
              <td className="p-1 border text-center align-top">
                {company.num_employees}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default CompaniesTable;
