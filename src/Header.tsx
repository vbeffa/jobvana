import "./App.css";

function Header() {
  return (
    <div className="bg-amber-300 w-full h-12 text-left pl-2 pt-2 mb-4 top-0 left-0 sticky">
      <a href="/jobvana">Home</a> <a href="/jobvana/jobs/">Jobs</a>{" "}
      <a href="/jobvana/skills/">Skills</a>
    </div>
  );
}

export default Header;
