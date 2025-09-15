import { createFileRoute, Link } from '@tanstack/react-router';

export const Route = createFileRoute('/jobvana/about')({
  component: About
});

function About() {
  return (
    <div className="flex justify-center">
      <div className="pl-4 flex flex-col gap-2 max-w-[600px]">
        <span className="self-center">Terms</span>
        <h2>Companies</h2>
        <p>
          <Link to="/jobvana/companies">Companies</Link> have jobs.
        </p>
        <h2>Jobs</h2>
        <p>
          <Link to="/jobvana/jobs">Jobs</Link> have titles which are free-form
          (defined by the company).
        </p>
        <p>
          Jobs have one or more roles. The exact ratio of each role depends on
          the job. Each role has a percentage (1 - 100) and a level (1 - 5).
        </p>
        <p>Jobs have one or more requirements which are a list of skills.</p>
        <h2>Roles</h2>
        <p>
          <Link to="/jobvana/roles">Roles</Link> are high-level descriptions of
          a job's duties.
        </p>
        <h2>Skills</h2>
        <p>
          <Link to="/jobvana/skills">Skills</Link> are used in jobs. There is
          not a 1-1 relationship between skills and roles.
        </p>
      </div>
    </div>
  );
}
