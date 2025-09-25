import { useCallback, useState } from 'react';
import { FaPlus, FaX } from 'react-icons/fa6';
import PillContainer from '../../containers/PillContainer';
import Error from '../../Error';
import useSkillsLite from '../../skills/useSkillsLite';
import supabase from '../../utils/supabase';
import SkillSelect from '../SkillSelect';
import type { Job } from './useJobsForCompany';

export type MyJobSkillsProps = {
  job: Job;
  onUpdate: () => void;
};

const MyJobSkills = ({ job, onUpdate }: MyJobSkillsProps) => {
  const [isAdding, setIsAdding] = useState(false);
  const [error, setError] = useState<Error>();
  const { findSkill } = useSkillsLite();

  const addSkill = useCallback(
    async (skillId: number) => {
      if (job.job_skills.some((jobSkill) => jobSkill.skill_id === skillId)) {
        alert('Skill already exists');
        return;
      }

      let result = await supabase
        .from('job_skills')
        .insert({ job_id: job.id, skill_id: skillId });
      if (result.error) {
        console.log(result.error);
        setError(result.error);
        return;
      }

      result = await supabase
        .from('jobs')
        .update({
          updated_at: new Date().toISOString()
        })
        .eq('id', job.id);
      if (result.error) {
        throw result.error;
      }
    },
    [job.id, job.job_skills]
  );

  const deleteSkill = useCallback(
    async (skillId: number) => {
      let result = await supabase
        .from('job_skills')
        .delete()
        .eq('job_id', job.id)
        .eq('skill_id', skillId);
      if (result.error) {
        console.log(result.error);
        setError(result.error);
        return;
      }

      result = await supabase
        .from('jobs')
        .update({
          updated_at: new Date().toISOString()
        })
        .eq('id', job.id);
      if (result.error) {
        throw result.error;
      }
    },
    [job.id]
  );

  return (
    <>
      {error && (
        <div className="pb-2">
          <Error error={error} />
        </div>
      )}
      <div className="grid grid-cols-[20%_65%] gap-y-2 relative">
        <div>Skills:</div>
        <div className="flex flex-row gap-2">
          {job.job_skills.map((jobSkill, idx) => {
            const skill = findSkill(jobSkill.skill_id);
            return skill ? (
              <div key={idx}>
                <PillContainer
                  showX={true}
                  onClickX={async () => {
                    await deleteSkill(jobSkill.skill_id);
                    onUpdate();
                  }}
                >
                  {skill.name}
                </PillContainer>
              </div>
            ) : null;
          })}
          {!isAdding && (
            <div
              className="content-center cursor-pointer"
              onClick={() => setIsAdding(true)}
            >
              <FaPlus />
            </div>
          )}
          {isAdding && (
            <>
              <SkillSelect
                id="new_skill"
                showAny={false}
                showEmpty={true}
                onChange={async (skillId) => {
                  await addSkill(skillId);
                  setIsAdding(false);
                  onUpdate();
                }}
              />
              <div
                className="content-center text-sm cursor-pointer"
                onClick={() => setIsAdding(false)}
              >
                <FaX />
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default MyJobSkills;
