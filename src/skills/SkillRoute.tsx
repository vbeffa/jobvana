import ResourceContainer from '../containers/ResourceContainer';
import { Route } from '../routes/jobvana.skills.$skill_id.index';
import SkillDetails from './SkillDetails';

const SkillRoute = () => {
  const { skillId } = Route.useLoaderData();

  return (
    <ResourceContainer>
      <SkillDetails id={skillId} />
    </ResourceContainer>
  );
};

export default SkillRoute;
