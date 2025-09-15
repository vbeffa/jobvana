import { Route } from '../routes/jobvana.skill_categories.$id.skills.$skill_id.index';
import SkillDetails from './SkillDetails';

const SkillRoute = () => {
  const { skillId } = Route.useLoaderData();

  return (
    <div className="mx-4 flex flex-col gap-2">
      <SkillDetails id={skillId} />
    </div>
  );
};

export default SkillRoute;
