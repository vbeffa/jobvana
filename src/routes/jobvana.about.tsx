import { createFileRoute, Link } from '@tanstack/react-router';

export const Route = createFileRoute('/jobvana/about')({
  component: About
});

function About() {
  return (
    <div className="flex justify-center">
      <div className="pl-4 flex flex-col gap-2 max-w-[600px]">
        <span className="self-center">Gamifying the job search process.</span>
        <h2>Companies</h2>
        <p>
          <Link to="/jobvana/companies">Companies</Link> have jobs. Companies
          have tech stacks.
        </p>
        <h2>Jobs</h2>
        <p>
          <Link to="/jobvana/jobs">Jobs</Link> have titles which are free-form
          (defined by the company).
        </p>
        <p>
          Jobs have roles which are enumerated. Jobs can have multiple roles.
          The exact ratio of each role depends on the job.
        </p>
        <p>
          Jobs have tool requirements (e.g., Java). Tools are defined below.
          Jobs can also have tool version requirements.
        </p>
        <h2>Roles</h2>
        <p>
          <Link to="/jobvana/roles">Roles</Link> require multiple skills. The
          relationship between a job's role and its skills is not explicitly
          defined.
        </p>
        <h2>Skills</h2>
        <p>
          <Link to="/jobvana/skills_v2">Skills</Link> are put into practice
          using tools. There is not a 1-1 relationship between skills and tools.
          For example, Rust has features of both declarative (functional) and
          imperative (object-oriented) languages. Skills are provided mainly for
          reference, as companies usually have requirements for specific tools
          (usually referred to, confusingly, as skills).
        </p>
        <h2>Tools</h2>
        <p>
          <Link to="/jobvana/tools">Tools</Link> are versioned.
        </p>
        <h2>Tool Versions</h2>
        <p>
          Tool versions are defined by the tool provider. Each tool version has
          a unique ordinal number identifying its ordering. Tool versions also
          have release dates.
        </p>
        <h2>Tech Stacks</h2>
        <p>
          Tech stacks are a 1-N relationship between companies and tool
          versions.
        </p>
      </div>
    </div>
  );
}
