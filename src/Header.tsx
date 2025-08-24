import { Link } from "@tanstack/react-router";
import "./App.css";

const Header = () => {
  return (
    <div className="bg-amber-300 flex gap-2 w-full h-12 pl-2 pt-2.5 mb-4 top-0 left-0 sticky">
      <Link to="/" className="[&.active]:font-bold">
        Home
      </Link>{" "}
      <Link to="/about" className="[&.active]:font-bold">
        About
      </Link>{" "}
      <Link to="/jobs" className="[&.active]:font-bold">
        Jobs
      </Link>
      <Link to="/companies" className="[&.active]:font-bold">
        Companies
      </Link>
      <Link to="/skills" className="[&.active]:font-bold">
        Skills
      </Link>
    </div>
  );
};

export default Header;
