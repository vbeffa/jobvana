import _ from 'lodash';
import { useCallback, useEffect, useMemo, useState } from 'react';
import PillContainer from '../../containers/PillContainer';
import EditDeleteIcons from '../../controls/EditDeleteIcons';
import Error from '../../Error';
import useSkillsLite from '../../skills/useSkillsLite';
import type { JobSkill } from '../../types';
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

  return (
    <>
      {error && <Error error={error} />}
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
            <label htmlFor="skill_0" className="content-center">
              Skills:
            </label>
            {editJobSkills.map((jobSkill, idx) => (
              <div
                key={`role_${idx}_div`}
                className="col-start-2 flex flex-row gap-2"
              >
                <SkillSelect
                  id={`skill_${idx}`}
                  skillId={jobSkill.skill_id}
                  onChange={console.log}
                />
              </div>
            ))}
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
                    <PillContainer>{skill.name}</PillContainer>
                  </div>
                ) : null;
              })}
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default MyJobSkills;
