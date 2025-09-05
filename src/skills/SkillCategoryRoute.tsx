import { Route } from '../routes/jobvana.skill_categories.$id.index';
import SkillCategoryDetails from './SkillCategoryDetails';

const SkillCategoryRoute = () => {
  const { skillCategoryId } = Route.useLoaderData();

  return <SkillCategoryDetails id={skillCategoryId} />;
};

export default SkillCategoryRoute;
