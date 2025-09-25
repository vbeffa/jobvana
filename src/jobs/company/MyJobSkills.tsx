import { useCallback, useEffect, useState } from 'react';
import { FaPlus, FaX } from 'react-icons/fa6';
import PillContainer from '../../containers/PillContainer';
import EditDeleteIcons from '../../controls/EditDeleteIcons';
import Error from '../../Error';
import useSkillsLite from '../../skills/useSkillsLite';
import supabase from '../../utils/supabase';
import SkillSelect from '../SkillSelect';
import type { Edit } from './MyJobs';
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
                  {skill.name}
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
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default MyJobSkills;
