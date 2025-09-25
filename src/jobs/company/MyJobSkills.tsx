import _ from 'lodash';
import { useCallback, useEffect, useMemo, useState } from 'react';
import PillContainer from '../../containers/PillContainer';
import EditDeleteIcons from '../../controls/EditDeleteIcons';
import Error from '../../Error';
import SkillLink from '../../skills/SkillLink';
import useSkillsLite from '../../skills/useSkillsLite';
import type { JobSkill } from '../../types';
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
  const [editJobSkills, setEditJobSkills] = useState<Array<JobSkill>>(
    job.job_skills
  );
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<Error>();
  const { findSkill } = useSkillsLite();

  const isDirty = useMemo(
    () => !_.isEqual(job.job_skills, editJobSkills),
    [editJobSkills, job.job_skills]
  );

  useEffect(() => {
    if (edit.jobId !== job.id || edit.section !== 'skills') {
      setIsEditing(false);
    }
  }, [edit.jobId, edit.section, job.id]);

  const updateJobSkills = useCallback(async () => {
    let result = await supabase
      .from('job_skills')
      .delete()
      .filter('job_id', 'eq', job.id);
    if (result.error) {
      throw result.error;
    }

    result = await supabase.from('job_skills').upsert(editJobSkills, {
      onConflict: 'job_id, skill_id',
      ignoreDuplicates: true
    });
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
  }, [editJobSkills, job.id]);

  const doUpdate = useCallback(async () => {
    if (!isDirty) {
      return;
    }

    setIsSubmitting(true);
    setError(undefined);

    try {
      await updateJobSkills();
      onUpdate();
    } catch (err) {
      console.log(err);
      setError(err as Error);
    } finally {
      setIsSubmitting(false);
    }
  }, [isDirty, onUpdate, updateJobSkills]);

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
      {error && <Error error={error} />}
      <div className="relative grid grid-cols-[15%_75%] gap-y-2 mb-4">
        <EditDeleteIcons
          isEditing={isEditing}
          setIsEditing={(isEditing) => {
            if (isEditing) {
              setError(undefined);
              setEdit({ jobId: job.id, section: 'skills' });
            }
            setIsEditing(isEditing);
          }}
          disabled={isEditing && (!isDirty || isSubmitting)}
          onSave={doUpdate}
        />
        <div>Skills:</div>
        <div className="flex flex-row flex-wrap gap-2">
          {!isEditing &&
            job.job_skills.map((jobSkill, idx) => {
              const skill = findSkill(jobSkill.skill_id);
              return skill ? (
                <div key={idx}>
                  <PillContainer
                    showDeleteIcon={isEditing}
                    onDelete={async () => {
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
              <MySkillsSelect
                skillIds={editJobSkills.map((jobSkill) => jobSkill.skill_id)}
                onAddSkill={(skillId) => {
                  setEditJobSkills((jobSkills) => {
                    const updatedJobSkills = _.cloneDeep(jobSkills);
                    updatedJobSkills.push({
                      job_id: job.id,
                      skill_id: skillId
                    });
                    return updatedJobSkills;
                  });
                }}
                onDeleteSkill={(skillId) => {
                  setEditJobSkills((jobSkills) => {
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
    </>
  );
};

export default MyJobSkills;
