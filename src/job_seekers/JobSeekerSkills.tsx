import _ from 'lodash';
import { useCallback, useEffect, useMemo, useState } from 'react';
import Button from '../controls/Button';
import supabase from '../db/supabase';
import SkillsSelect from '../jobs/SkillsSelect';
import JobvanaError from '../JobvanaError';
import { type JobSeeker } from '../types';
import useSkillsForJobSeeker from './useSkillsForJobSeeker';

export type JobSeekerSkillsProps = {
  jobSeeker: JobSeeker;
  isOnboarding?: boolean;
};

const JobSeekerSkills = ({ jobSeeker }: JobSeekerSkillsProps) => {
  const [editSkillIds, setEditSkillIds] = useState<Array<number> | undefined>();
  const { skills, refetch } = useSkillsForJobSeeker(jobSeeker.id);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [error, setError] = useState<Error>();

  const selectedSkillIds = useMemo(
    () => skills?.map((skill) => skill.id),
    [skills]
  );

  useEffect(() => {
    setEditSkillIds(selectedSkillIds);
  }, [selectedSkillIds]);

  const isDirty = useMemo(
    () => !_.isEqual(selectedSkillIds, editSkillIds),
    [editSkillIds, selectedSkillIds]
  );

  const saveSkills = useCallback(async () => {
    if (!editSkillIds) {
      return;
    }

    let result = await supabase
      .from('job_seeker_skills')
      .delete()
      .filter('job_seeker_id', 'eq', jobSeeker.id);
    if (result.error) {
      throw result.error;
    }

    const toUpsert = editSkillIds.map((skillId) => ({
      job_seeker_id: jobSeeker.id,
      skill_id: skillId
    }));
    result = await supabase.from('job_seeker_skills').upsert(toUpsert, {
      onConflict: 'job_seeker_id, skill_id',
      ignoreDuplicates: true
    });
    if (result.error) {
      throw result.error;
    }
  }, [editSkillIds, jobSeeker.id]);

  const doSave = useCallback(async () => {
    setIsSubmitting(true);
    setUpdateSuccess(false);
    setError(undefined);
    try {
      await saveSkills();
      await refetch();
      setUpdateSuccess(true);
    } catch (err) {
      console.log(err);
      setError(err as Error);
    } finally {
      setIsSubmitting(false);
    }
  }, [refetch, saveSkills]);

  if (!editSkillIds) {
    return null;
  }

  return (
    <>
      <SkillsSelect
        selectedSkillIds={editSkillIds}
        width="w-[75%]"
        outerHeight="h-64"
        innerHeight="h-63"
        onChange={(skillIds) => {
          setEditSkillIds(skillIds);
        }}
      />
      <div className="w-[75%] flex justify-center mt-4">
        <Button
          label="Save"
          disabled={!isDirty || isSubmitting}
          onClick={doSave}
        />
      </div>
      <div className="w-[75%] text-center mt-2">
        {updateSuccess && <>Skills saved.</>}
        {error && <JobvanaError error={error} />}
      </div>
    </>
  );
};

export default JobSeekerSkills;
