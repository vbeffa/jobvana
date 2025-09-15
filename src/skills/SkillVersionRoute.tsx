import { Route } from '../routes/jobvana.skill_categories.$id.skills.$skill_id.skill_versions.$skill_version_id';
import SkillVersionDetails from './SkillVersionDetails';

const SkillVersion = () => {
  const { skillId, skillVersionId } = Route.useLoaderData();

  return (
    <div className="mx-4 flex flex-col gap-2">
      <SkillVersionDetails skillId={skillId} skillVersionId={skillVersionId} />
    </div>
  );
};

export default SkillVersion;
