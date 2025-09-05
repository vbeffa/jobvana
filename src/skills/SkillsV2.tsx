import { Link } from '@tanstack/react-router';
import useSkillsV2 from '../hooks/useSkillsV2';
import Loading from '../Loading';

const SkillsV2 = () => {
  const { skills } = useSkillsV2();

  return (
    <>
      <h1>Skills</h1>
      <div className="flex justify-center">
        <div className="my-4 w-[50%] min-w-[1000px]">
          <table className="w-full">
            <thead>
              <tr>
                <th className="cursor-pointer w-[15%]">Skill</th>
                <th className="cursor-pointer w-[70%]">Description</th>
                <th className="cursor-pointer w-[15%]">Reference</th>
              </tr>
            </thead>
            <tbody>
              <Loading waitingFor={skills} colSpan={2} />
              {skills?.map((skill) => {
                return (
                  <tr key={skill.id}>
                    <td>{skill.name}</td>
                    <td className="whitespace-pre-wrap">{skill.description}</td>
                    <td>
                      {skill.reference && (
                        <Link to={skill.reference}>{skill.reference}</Link>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default SkillsV2;
