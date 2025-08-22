import "./App.css";

export type CurrentPage =
  | "home"
  | "jobs"
  | "job"
  | "skills"
  | "skill"
  | "skill_version"
  | "companies"
  | "company";

function Header({ currPage }: { currPage: CurrentPage }) {
  return (
    <div className="bg-amber-300 w-full h-12 pl-2 pt-2.5 mb-4 top-0 left-0 sticky">
      {currPage === "home" && "Home"}
      {currPage !== "home" && <a href="/jobvana">Home</a>} •{" "}
      {currPage === "jobs" && "Jobs"}
      {currPage !== "jobs" && <a href="/jobvana/jobs/">Jobs</a>} •{" "}
      {currPage === "skills" && "Skills"}
      {currPage !== "skills" && <a href="/jobvana/skills/">Skills</a>} •{" "}
      {currPage === "companies" && "Companies"}
      {currPage !== "companies" && <a href="/jobvana/companies/">Companies</a>}
    </div>
  );
}

export default Header;
