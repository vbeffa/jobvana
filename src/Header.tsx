import type { AppState, CurrentPage } from "./App";
import "./App.css";

const Header = ({
  appState,
  setCurrPage
}: {
  appState: AppState;
  setCurrPage: (page: CurrentPage) => void;
}) => {
  return (
    <div className="bg-amber-300 w-full h-12 pl-2 pt-2.5 mb-4 top-0 left-0 sticky">
      {appState.currPage === "jobs" && "Jobs"}
      {appState.currPage !== "jobs" && (
        <span
          className="text-blue-600 cursor-pointer"
          onClick={() => setCurrPage("jobs")}
        >
          Jobs
        </span>
      )}{" "}
      {appState.currPage === "job" && <></>}•{" "}
      {appState.currPage === "skills" && "Skills"}
      {appState.currPage !== "skills" && (
        <span
          className="text-blue-600 cursor-pointer"
          onClick={() => setCurrPage("skills")}
        >
          Skills
        </span>
      )}{" "}
      • {appState.currPage === "companies" && "Companies"}
      {appState.currPage !== "companies" && (
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
