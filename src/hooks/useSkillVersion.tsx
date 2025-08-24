import useSkills from "./useSkills";

const useSkillVersion = ({ id }: { id: number }) => {
  const { skillVersions } = useSkills();

  return {
    skillVersion: skillVersions?.find((skill) => skill.id === id)
  };
};

export default useSkillVersion;
