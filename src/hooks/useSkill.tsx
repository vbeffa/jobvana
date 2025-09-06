import useSkills, { type SkillsParams } from './useSkills';

const useSkill = ({
  id,
  paging
}: {
  id: number;
  paging: SkillsParams['paging'];
}) => {
  const { skills } = useSkills({ paging });

  return {
    skill: skills?.find((skill) => skill.id === id)
  };
};

export default useSkill;
