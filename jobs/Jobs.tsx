import SkillLink from "../skills/SkillLink";
import "../src/App.css";
import Header from "../src/Header";
import useCompanies from "../src/hooks/useCompanies";
import useJobs from "../src/hooks/useJobs";

function Skills() {
  const companies = useCompanies();
  const jobs = useJobs();

  if (jobs.all.length === 0) {
    return (
      <div>
        <Header currPage="jobs" />
        Loading...
      </div>
    );
  }

  return (
    <>
      <Header currPage="jobs" />
      <h1>Jobs</h1>
      <div className="card">
        <table className="border-1 w-full">
          <thead>
            <tr key={0}>
              <th className="p-1 border">Company</th>
              <th className="p-1 border">Title</th>
              <th className="p-1 border">Created</th>
              <th className="p-1 border">Status</th>
              <th className="p-1 border">Skills</th>
            </tr>
          </thead>
          <tbody>
            {jobs.all.map((job) => {
              return (
                <tr key={job.id}>
                  <td className="p-1 border text-left align-top">
                    {companies.company(job.company_id)?.name}
                  </td>
                  <td className="p-1 border text-left align-top">
                    <a href={`/jobvana/jobs/?id=${job.id}`}>{job.title}</a>
                  </td>
                  <td className="p-1 border text-left align-top">
                    {new Date(job.created_at).toDateString()}
                  </td>
                  <td className="p-1 border text-left align-top">
                    {job.status}
                  </td>
                  <td className="p-1 border text-left">
                    <ul className="list-inside list-disc">
                      {job.skills.map((skill) => (
                        <li key={skill.id}>
                          <SkillLink skill={skill} />
                        </li>
                      ))}
                    </ul>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default Skills;
