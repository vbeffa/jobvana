import "../src/App.css";
import Header from "../src/Header";
import useSkills from "../src/hooks/useSkills";

function Skills() {
  const skills = useSkills();
  const all = skills.all;
  const skillTypes = skills.types;

  if (all.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Header />
      <h1>Skills</h1>
      <div className="card">
        <table className="border-1 w-full">
          <thead>
            <tr key={0}>
              <th className="p-1 border">Skill</th>
              <th className="p-1 border">Abbreviation</th>
              <th className="p-1 border">Skill Type</th>
              <th className="p-1 border">Description</th>
              <th className="p-1 border">Reference</th>
            </tr>
          </thead>
          <tbody>
            {all.map((skill) => {
              return (
                <tr key={skill.id}>
                  <td className="p-1 border text-left">
                    <a href={`/jobvana/skills/?id=${skill.id}`}>{skill.name}</a>
                  </td>
                  <td className="p-1 border text-left">{skill.abbreviation}</td>
                  <td className="p-1 border text-left">
                    {
                      skillTypes.find(
                        (skillType) => skillType.id === skill.skill_type_id
                      )?.name
                    }
                  </td>
                  <td className="p-1 border text-left">{skill.description}</td>
                  <td className="p-1 border text-left">
                    {skill.reference && (
                      <a target="_blank" href={skill.reference}>
                        {skill.reference}
                      </a>
                    )}
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
