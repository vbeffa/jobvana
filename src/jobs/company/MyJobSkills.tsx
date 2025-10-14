import PillContainer from '../../containers/PillContainer';
import Label from '../../inputs/Label';
import SkillLink from '../../skills/SkillLink';
import useSkillsLite from '../../skills/useSkillsLite';
import type { JobSkill } from '../../types';
import SkillsSelect from '../SkillsSelect';
import type { Job } from './useJobs';

export type MyJobSkillsProps = {
  job: Job;
  jobSkills: Array<JobSkill>;
  setJobSkills: React.Dispatch<React.SetStateAction<Array<JobSkill>>>;
  isEditing: boolean;
};

const MyJobSkills = ({
  job,
  jobSkills,
  setJobSkills,
  isEditing
}: MyJobSkillsProps) => {
  const { findSkill } = useSkillsLite();

  return (
    <div className="relative grid grid-cols-[15%_85%] gap-y-2 mb-4">
      {!isEditing && <div>Skills:</div>}
      {isEditing && (
        <Label
          htmlFor="skills_filter"
          label="Skills"
          contentAlign="content-start"
        />
      )}
      <div className="flex flex-row flex-wrap gap-2">
        {!isEditing &&
          jobSkills
            .sort((jobSkill1, jobSkill2) => {
              const skill1 = findSkill(jobSkill1.skill_id);
              const skill2 = findSkill(jobSkill2.skill_id);
              if (!skill1 || !skill2) {
                return 0;
              }
              return (skill1.abbreviation ?? skill1.name).localeCompare(
                skill2.abbreviation ?? skill2.name
              );
            })
            .map((jobSkill, idx) => {
              const skill = findSkill(jobSkill.skill_id);
              return skill ? (
                <div key={idx}>
                  <PillContainer>
                    <SkillLink skill={skill} />
                  </PillContainer>
                </div>
              ) : null;
            })}
        {isEditing && (
          <SkillsSelect
            selectedSkillIds={jobSkills.map((jobSkill) => jobSkill.skill_id)}
            width="w-[100%]"
            outerHeight="h-64"
            innerHeight="max-h-63"
            onChange={(skillIds) => {
              setJobSkills(
                skillIds.map((skillId) => ({
                  job_id: job.id,
                  skill_id: skillId
                }))
              );
            }}
          />
        )}
      </div>
    </div>
  );
};

export default MyJobSkills;
