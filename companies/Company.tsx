import "../src/App.css";
import Header from "../src/Header";
import useCompanies from "../src/hooks/useCompanies";

function Company({ id }: { id: number }) {
  const companies = useCompanies();
  const company = companies.company(id);

  if (!company) {
    return (
      <div>
        <Header currPage="company" />
        Loading...
      </div>
    );
  }

  return (
    <>
      <Header currPage="company" />
      <h1>{company.name}</h1>
      <h2>Size</h2>
      <div className="card text-left">{company.num_employees}</div>
    </>
  );
}

export default Company;
