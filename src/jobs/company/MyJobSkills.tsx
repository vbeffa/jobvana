import { useCallback, useEffect, useState } from 'react';
import { FaPlus } from 'react-icons/fa6';
import PillContainer from '../../containers/PillContainer';
import EditDeleteIcons from '../../controls/EditDeleteIcons';
import Error from '../../Error';
import SkillLink from '../../skills/SkillLink';
import useSkillsLite from '../../skills/useSkillsLite';
import supabase from '../../utils/supabase';
import type { Edit } from './MyJobs';
import MySkillsSelect from './MySkillsSelect';
import type { Job } from './useJobsForCompany';

export type MyJobSkillsProps = {
  job: Job;
  onUpdate: () => void;
  edit: Edit;
  setEdit: (edit: Edit) => void;
};

const MyJobSkills = ({ job, onUpdate, edit, setEdit }: MyJobSkillsProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [error, setError] = useState<Error>();
  const { findSkill } = useSkillsLite();

  useEffect(() => {
    if (edit.jobId !== job.id || edit.section !== 'skills') {
      setIsEditing(false);
    }
  }, [edit.jobId, edit.section, job.id]);

  const addSkills = useCallback(
    async (skillIds: Array<number>) => {
      // if (job.job_skills.some((jobSkill) => jobSkill.skill_id === skillId)) {
      //   alert('Skill already exists');
      //   return;
      // }
      console.log('adding', skillIds);

      let result = await supabase
        .from('job_skills')
        .insert(
          skillIds.map((skillId) => ({ job_id: job.id, skill_id: skillId }))
        );
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
        <EditDeleteIcons
          isEditing={isEditing}
          setIsEditing={(isEditing) => {
            if (isEditing) {
              setError(undefined);
              setEdit({ jobId: job.id, section: 'skills' });
            }
            setIsEditing(isEditing);
          }}
        />
        <div>Skills:</div>
        <div className="flex flex-row flex-wrap gap-2">
          {job.job_skills.map((jobSkill, idx) => {
            const skill = findSkill(jobSkill.skill_id);
            return skill ? (
              <div key={idx}>
                <PillContainer
                  showX={isEditing}
                  onClickX={async () => {
                    await deleteSkill(jobSkill.skill_id);
                    onUpdate();
                  }}
                >
                  <SkillLink skill={skill} />
                </PillContainer>
              </div>
            ) : null;
          })}
          {isEditing && (
            <>
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
                  <MySkillsSelect
                    skillIds={job.job_skills.map(
                      (jobSkill) => jobSkill.skill_id
                    )}
                    onAddSkills={async (skillIds) => {
                      await addSkills(skillIds);
                      setIsAdding(false);
                      onUpdate();
                    }}
                    onCancel={() => setIsAdding(false)}
                  />
                </>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default MyJobSkills;
