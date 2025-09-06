import SkillsTable from './SkillsTable';

const Skills = () => {
  return (
    <>
      <h1>Skills</h1>
      <div className="flex justify-center">
        <div className="my-4 w-[50%] min-w-[1000px]">
          <SkillsTable />
        </div>
      </div>
    </>
  );
};

export default Skills;
