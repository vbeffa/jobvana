import "../src/App.css";
import Header from "../src/Header";
import useCompanies from "../src/hooks/useCompanies";
import CompanyLink from "./CompanyLink";

const Skills = () => {
  const companies = useCompanies();

  if (companies.all.length === 0) {
    return (
      <div>
        <Header currPage="companies" />
        Loading...
      </div>
    );
  }

  return (
    <>
      <Header currPage="companies" />
      <h1>Companies</h1>
      <div className="card text-center justify-center">
        <table className="border-1">
          <thead>
            <tr key={0}>
              <th className="p-1 border">Name</th>
            </tr>
          </thead>
          <tbody>
            {companies.all.map((company) => {
              return (
                <tr key={company.id}>
                  <td className="p-1 border text-left align-top">
                    <CompanyLink company={company} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default Skills;
