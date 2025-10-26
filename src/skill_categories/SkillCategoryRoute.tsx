import ResourceContainer from '../containers/ResourceContainer';
import { Route } from '../routes/jobvana.skill_categories.$id.index';
import SkillCategoryDetails from './SkillCategoryDetails';

const SkillCategoryRoute = () => {
  const { skillCategoryId } = Route.useLoaderData();

  return (
    <ResourceContainer>
      <SkillCategoryDetails id={skillCategoryId} />
    </ResourceContainer>
  );
};

export default SkillCategoryRoute;
