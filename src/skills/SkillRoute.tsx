import { Route } from '../routes/jobvana.skill_categories.$id.skills.$skill_id.index';
import SkillDetails from './SkillDetails';

const SkillRoute = () => {
  const { skillId } = Route.useLoaderData();

  return (
    <SkillDetails
      id={skillId}
      paging={{ page: 1, pageSize: 1000 }} // TODO fix paging
    />
  );
};

export default SkillRoute;
