import useSkills from './useSkills';

const useSkill = ({ id }: { id: number }) => {
  const { skills } = useSkills();

  return {
    skill: skills?.find((skill) => skill.id === id)
  };
};

export default useSkill;
