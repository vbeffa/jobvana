import { Link } from "@tanstack/react-router";
import "./App.css";

const Header = () => {
  return (
    <div className="bg-amber-300 flex gap-2 w-full h-12 pl-2 pt-2.5 mb-4 top-0 left-0 sticky z-10">
      <Link to="/jobvana" className="[&.active]:font-bold">
        Home
      </Link>
      {" • "}
      <Link to="/jobvana/about" className="[&.active]:font-bold">
        About
      </Link>
      {" • "}
      <Link to="/jobvana/jobs" className="[&.active]:font-bold">
        Jobs
      </Link>
      {" • "}
      <Link to="/jobvana/companies" className="[&.active]:font-bold">
        Companies
      </Link>
      {" • "}
      <Link to="/jobvana/skills" className="[&.active]:font-bold">
        Skills
      </Link>
      {" • "}
      <Link to="/jobvana/skill_categories" className="[&.active]:font-bold">
        Skill Categories
      </Link>
    </div>
  );
};

export default Header;
