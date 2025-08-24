import { createRootRoute, Link, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

export const Route = createRootRoute({
  component: () => (
    <>
      <div className="p-2 flex gap-2 w-full bg-amber-300">
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
      <hr />
      <Outlet />
      <TanStackRouterDevtools />
    </>
  )
});
