import { Route } from '../routes/jobvana.skill_categories.$id.skills.$skill_id.skill_versions.$skill_version_id';
import SkillVersionDetails from './SkillVersionDetails';

const SkillVersion = () => {
  const { skillVersionId } = Route.useLoaderData();

  return <SkillVersionDetails id={skillVersionId} />;
};

export default SkillVersion;
