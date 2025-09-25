import _ from 'lodash';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { FaPlus } from 'react-icons/fa6';
import PillContainer from '../../containers/PillContainer';
import EditDeleteIcons from '../../controls/EditDeleteIcons';
import Error from '../../Error';
import useSkillsLite from '../../skills/useSkillsLite';
import type { JobSkill } from '../../types';
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
  const [editJobSkills, setEditJobSkills] = useState<Array<JobSkill>>(
    job.job_skills
  );
  const [isEditing, setIsEditing] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<Error>();
  const { findSkill } = useSkillsLite();

  const isDirty = useMemo(
    () => !_.isEqual(job.job_skills, editJobSkills),
    [editJobSkills, job.job_skills]
  );
  const isValid = useMemo(() => false, []);

  useEffect(() => {
    if (edit.jobId !== job.id || edit.section !== 'skills') {
      setIsEditing(false);
    }
  }, [edit.jobId, edit.section, job.id]);

  const updateJobSkills = useCallback(async () => {}, []);

  const doUpdate = useCallback(async () => {
    if (!isValid || !isDirty) {
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
  }, [isDirty, isValid, onUpdate, updateJobSkills]);

  const addSkill = useCallback(
    async (skillId: number) => {
      if (job.job_skills.some((jobSkill) => jobSkill.skill_id === skillId)) {
        alert('Skill already exists');
        return;
      }
      const { error } = await supabase
        .from('job_skills')
        .insert({ job_id: job.id, skill_id: skillId });
      if (error) {
        console.log(error);
        setError(error);
      }
    },
    [job.id, job.job_skills]
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
          disabled={isEditing && (!isDirty || !isValid || isSubmitting)}
          onEdit={() => setEditJobSkills(job.job_skills)}
          onSave={doUpdate}
          bgColor="--color-white"
        />

        {isEditing && (
          <>
            <label htmlFor="skills" className="content-start">
              Skills:
            </label>
            <div
              id="skills"
              className="border p-1 flex flex-row gap-1 min-h-32"
            >
              {editJobSkills.map((jobSkill, idx) => {
                const skill = findSkill(jobSkill.skill_id);
                return skill ? (
                  <div key={idx}>
                    <PillContainer
                      showX={true}
                      onClickX={() => {
                        setEditJobSkills((jobSkills) => {
                          const updatedSkills = _.cloneDeep(jobSkills);
                          updatedSkills.splice(idx, 1);
                          return updatedSkills;
                        });
                      }}
                    >
                      {skill.name}
                    </PillContainer>
                  </div>
                ) : null;
              })}
            </div>
          </>
        )}

        {!isEditing && (
          <>
            <div>Skills:</div>
            <div className="flex flex-row gap-2">
              {job.job_skills.map((jobSkill, idx) => {
                const skill = findSkill(jobSkill.skill_id);
                return skill ? (
                  <div key={idx}>
                    <PillContainer
                      showX={true}
                      onClickX={() => {
                        setEditJobSkills((jobSkills) => {
                          const updatedSkills = _.cloneDeep(jobSkills);
                          updatedSkills.splice(idx, 1);
                          return updatedSkills;
                        });
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
            </div>
            {isAdding && (
              <div className="col-start-2">
                <SkillSelect
                  id="new_skill"
                  showAny={false}
                  showEmpty={true}
                  onChange={async (skillId) => {
                    console.log(skillId);
                    await addSkill(skillId);
                    setIsAdding(false);
                  }}
                />
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default MyJobSkills;
