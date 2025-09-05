import { Route } from '../routes/jobvana.skill_categories.$id.skills.$skill_id.index';
import SkillDetails from './SkillDetails';

const SkillRoute = () => {
  const { skillId } = Route.useLoaderData();

  return <SkillDetails id={skillId} />;
};

export default SkillRoute;
