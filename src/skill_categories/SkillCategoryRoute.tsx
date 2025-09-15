import { Route } from '../routes/jobvana.skill_categories.$id.index';
import SkillCategoryDetails from './SkillCategoryDetails';

const SkillCategoryRoute = () => {
  const { skillCategoryId } = Route.useLoaderData();

  return (
    <div className="mx-4 flex flex-col gap-2">
      <SkillCategoryDetails id={skillCategoryId} />
    </div>
  );
};

export default SkillCategoryRoute;
