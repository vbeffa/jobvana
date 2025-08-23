import "./App.css";

export type CurrentPage =
  | "jobs"
  | "job"
  | "skills"
  | "skill"
  | "skill_version"
  | "companies"
  | "company";

const Header = ({
  currPage,
  setCurrPage
}: {
  currPage: CurrentPage;
  setCurrPage: (page: CurrentPage) => void;
}) => {
  return (
    <div className="bg-amber-300 w-full h-12 pl-2 pt-2.5 mb-4 top-0 left-0 sticky">
      {currPage === "jobs" && "Jobs"}
      {currPage !== "jobs" && (
        <span
          className="text-blue-600 cursor-pointer"
          onClick={() => setCurrPage("jobs")}
        >
          Jobs
        </span>
      )}{" "}
      • {currPage === "skills" && "Skills"}
      {currPage !== "skills" && (
        <span
          className="text-blue-600 cursor-pointer"
          onClick={() => setCurrPage("skills")}
        >
          Skills
        </span>
      )}{" "}
      • {currPage === "companies" && "Companies"}
      {currPage !== "companies" && (
        <span
          className="text-blue-600 cursor-pointer"
          onClick={() => setCurrPage("companies")}
        >
          Companies
        </span>
      )}
    </div>
  );
};

export default Header;
