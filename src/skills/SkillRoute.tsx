import Error from '../Error';
import useSkill from '../hooks/useSkill';
import LoadingModal from '../LoadingModal';
import { Route } from '../routes/jobvana.skill_categories.$id.skills.$skill_id.index';
import SkillDetails from './SkillDetails';

const SkillRoute = () => {
  const { skillId } = Route.useLoaderData();
  const { skill, error, isPending, isPlaceholderData } = useSkill(skillId);

  if (error) {
    return <Error error={error} />;
  }

  if (isPending) {
    return <LoadingModal />;
  }

  if (!skill) {
    return null;
  }

  return <SkillDetails skill={skill} isPlaceholderData={isPlaceholderData} />;
};

export default SkillRoute;
