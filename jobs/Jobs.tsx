import { useEffect, useState } from "react";
import supabase from "../src/utils/supabase";

import "../src/App.css";
import type { Database } from "../src/utils/types";
import Header from "../src/Header";

type Job = Database["public"]["Tables"]["jobs"]["Row"] & {
  skills: Array<Skill>;
};
type Company = Database["public"]["Tables"]["companies"]["Row"];
type JobSkill = Database["public"]["Tables"]["job_skills"]["Row"];
type Skill = Database["public"]["Tables"]["skills"]["Row"];

function Skills() {
  const [jobs, setJobs] = useState<Array<Job>>([]);
  const [companies, setCompanies] = useState<Array<Company>>([]);
  const [jobSkills, setJobSkills] = useState<Array<JobSkill>>([]);
  const [skills, setSkills] = useState<Array<Skill>>([]);

  useEffect(() => {
    if (jobs.length > 0 || jobSkills.length === 0 || skills.length === 0) {
      return;
    }
    (async () => {
      const { data } = await supabase.from("jobs").select();
      if (data === null) {
        return;
      }
      const jobs: Array<Job> = data.map((job) => ({
        ...job,
        skills: skills.filter((skill) =>
          jobSkills
            .filter((jobSkill) => jobSkill.job_id === job.id)
            .map((jobSkill) => jobSkill.skill_id)
            .includes(skill.id)
        )
      }));
      setJobs(jobs);
    })();
  }, [jobSkills, jobSkills.length, jobs.length, skills]);

  useEffect(() => {
    if (companies.length > 0) {
      return;
    }
    (async () => {
      const { data: companies } = await supabase.from("companies").select();
      if (companies === null) {
        return;
      }
      setCompanies(companies);
    })();
  }, [companies.length]);

  useEffect(() => {
    if (jobSkills.length > 0) {
      return;
    }
    (async () => {
      const { data: jobSkills } = await supabase.from("job_skills").select();
      if (jobSkills === null) {
        return;
      }
      setJobSkills(jobSkills);
    })();
  }, [jobSkills.length]);

  useEffect(() => {
    if (skills.length > 0) {
      return;
    }
    (async () => {
      const { data: skills } = await supabase.from("skills").select();
      if (skills === null) {
        return;
      }
      setSkills(skills);
    })();
  }, [skills.length]);

  if (jobs.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Header />
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
            {jobs.map((job) => {
              return (
                <tr key={job.id}>
                  <td className="p-1 border text-left">
                    {
                      companies.find((company) => company.id === job.company_id)
                        ?.name
                    }
                  </td>
                  <td className="p-1 border text-left">{job.title}</td>
                  <td className="p-1 border text-left">
                    {new Date(job.created_at).toDateString()}
                  </td>
                  <td className="p-1 border text-left">{job.status}</td>
                  <td className="p-1 border text-left">
                    <ul className="list-inside list-disc">
                      {job.skills.map((skill) => (
                        <li key={skill.id}>{skill.name}</li>
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
