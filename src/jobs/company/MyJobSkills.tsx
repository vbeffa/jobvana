import _ from 'lodash';
import PillContainer from '../../containers/PillContainer';
import SkillLink from '../../skills/SkillLink';
import useSkillsLite from '../../skills/useSkillsLite';
import type { JobSkill } from '../../types';
import MySkillsSelect from './MySkillsSelect';
import type { Job } from './useJobsForCompany';

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
    <div className="relative grid grid-cols-[15%_75%] gap-y-2 mb-4">
      <div>Skills:</div>
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
          <>
            <MySkillsSelect
              skillIds={jobSkills.map((jobSkill) => jobSkill.skill_id)}
              onAddSkill={(skillId) => {
                setJobSkills((jobSkills) => {
                  const updatedJobSkills = _.cloneDeep(jobSkills);
                  updatedJobSkills.push({
                    job_id: job.id,
                    skill_id: skillId
                  });
                  return updatedJobSkills;
                });
              }}
              onDeleteSkill={(skillId) => {
                setJobSkills((jobSkills) => {
                  const updatedJobSkills = _.cloneDeep(jobSkills);
                  const index = updatedJobSkills.findIndex(
                    (jobSkill) => jobSkill.skill_id === skillId
                  );
                  updatedJobSkills.splice(index, 1);
                  return updatedJobSkills;
                });
              }}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default MyJobSkills;
