import _ from 'lodash';
import { useCallback, useEffect, useMemo, useState } from 'react';
import type { Company } from '../../Context';
import EditDeleteButtons from '../../controls/EditDeleteButtons';
import supabase from '../../db/supabase';
import Hr from '../../Hr';
import JobvanaError from '../../JobvanaError';
import type { CompanyAddress, JobRole, JobSkill } from '../../types';
import MyJobMain from './MyJobMain';
import MyJobRoles from './MyJobRoles';
import MyJobSkills from './MyJobSkills';
import type { Job } from './useJobsForCompany';
import { areValidJobRoles, duplicateJobRoles, isValidJob } from './utils';

export type MyJobProps = {
  company: Company;
  job: Job;
  isNew: boolean;
  addresses: Array<CompanyAddress>;
  onStartUpdate: () => void;
  onFinishUpdate: (error?: Error) => void;
  onCancelNewJob: () => void;
};

const MyJob = ({
  company,
  job,
  isNew,
  addresses,
  onStartUpdate,
  onFinishUpdate,
  onCancelNewJob
}: MyJobProps) => {
  const [editJob, setEditJob] = useState<Job>(job);
  const [updateInterviewProcess, setUpdateInterviewProcess] = useState(true);
  const [editJobRoles, setEditJobRoles] = useState<Array<JobRole>>(
    job.job_roles
  );
  const [editJobSkills, setEditJobSkills] = useState<Array<JobSkill>>(
    job.job_skills
  );
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<Error>();

  const isJobDirty = useMemo(() => !_.isEqual(job, editJob), [editJob, job]);
  const isJobValid = useMemo(() => isValidJob(editJob), [editJob]);

  const areJobRolesDirty = useMemo(
    () => !_.isEqual(job.job_roles, editJobRoles),
    [editJobRoles, job.job_roles]
  );

  const duplicateRole = useMemo(() => {
    return duplicateJobRoles(editJobRoles);
  }, [editJobRoles]);

  const areJobRolesValid = useMemo(
    () => areValidJobRoles(editJobRoles),
    [editJobRoles]
  );

  const areJobSkillsDirty = useMemo(
    () => !_.isEqual(job.job_skills, editJobSkills),
    [editJobSkills, job.job_skills]
  );

  useEffect(() => setIsEditing(isNew), [isNew]);

  useEffect(() => {
    setEditJob(job);
    setEditJobRoles(job.job_roles);
    setEditJobSkills(job.job_skills);
  }, [job]);

  const updateJob = useCallback(async () => {
    const toUpdate = _.omit(editJob, 'job_roles', 'job_skills');
    if (toUpdate.company_address_id === -1) {
      toUpdate.company_address_id = null;
    }
    if (updateInterviewProcess) {
      toUpdate.interview_process = company.interview_process;
    }
    const { error } = await supabase
      .from('jobs')
      .update({
        ...toUpdate,
        updated_at: new Date().toISOString()
      })
      .eq('id', job.id);

    if (error) {
      throw error;
    }
  }, [company.interview_process, editJob, job.id, updateInterviewProcess]);

  const createJob = useCallback(async () => {
    const toInsert = _.omit(editJob, 'id', 'job_roles', 'job_skills');
    if (toInsert.company_address_id === -1) {
      toInsert.company_address_id = null;
    }
    const { data, error } = await supabase
      .from('jobs')
      .insert({
        ...toInsert,
        updated_at: new Date().toISOString()
      })
      .select();

    if (error) {
      throw error;
    }
    return data[0].id;
  }, [editJob]);

  const deleteJob = useCallback(async () => {
    setIsSubmitting(true);
    setError(undefined);

    try {
      const { error } = await supabase.from('jobs').delete().eq('id', job.id);

      if (error) {
        console.log(error);
        setError(error);
      }
    } finally {
      setIsSubmitting(false);
    }
  }, [job.id]);

  const updateJobRoles = useCallback(
    async (jobId?: number) => {
      let result = await supabase
        .from('job_roles')
        .delete()
        .filter('job_id', 'eq', jobId ?? job.id);
      if (result.error) {
        throw result.error;
      }

      const toUpsert = editJobRoles.map((jobRole) => ({
        ...jobRole,
        job_id: jobId ?? jobRole.job_id
      }));
      result = await supabase.from('job_roles').upsert(toUpsert, {
        onConflict: 'job_id, role_id',
        ignoreDuplicates: true
      });
      if (result.error) {
        throw result.error;
      }

      result = await supabase
        .from('jobs')
        .update({
          updated_at: new Date().toISOString()
        })
        .eq('id', jobId ?? job.id);
      if (result.error) {
        throw result.error;
      }
    },
    [editJobRoles, job.id]
  );

  const updateJobSkills = useCallback(
    async (jobId?: number) => {
      let result = await supabase
        .from('job_skills')
        .delete()
        .filter('job_id', 'eq', jobId ?? job.id);
      if (result.error) {
        throw result.error;
      }

      const toUpsert = editJobSkills.map((jobSkill) => ({
        ...jobSkill,
        job_id: jobId ?? jobSkill.job_id
      }));
      result = await supabase.from('job_skills').upsert(toUpsert, {
        onConflict: 'job_id, skill_id',
        ignoreDuplicates: true
      });
      if (result.error) {
        throw result.error;
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
    [editJobSkills, job.id]
  );

  const onSave = useCallback(async () => {
    setIsEditing(false);
    setIsSubmitting(true);
    setError(undefined);
    onStartUpdate();
    try {
      let newJobId: number | undefined;
      if (isJobDirty && isJobValid) {
        if (isNew) {
          newJobId = await createJob();
        } else {
          await updateJob();
        }
      }
      if ((isNew || areJobRolesDirty) && areJobRolesValid) {
        await updateJobRoles(newJobId);
      }
      if (areJobSkillsDirty) {
        await updateJobSkills(newJobId);
      }
      onFinishUpdate();
    } catch (err) {
      console.log(err);
      setError(err as Error);
    } finally {
      setIsSubmitting(false);
      onFinishUpdate(error);
    }
  }, [
    areJobRolesDirty,
    areJobRolesValid,
    areJobSkillsDirty,
    createJob,
    error,
    isJobDirty,
    isJobValid,
    isNew,
    onFinishUpdate,
    onStartUpdate,
    updateJob,
    updateJobRoles,
    updateJobSkills
  ]);

  const onDelete = useCallback(async () => {
    setIsEditing(false);
    setIsSubmitting(true);
    setError(undefined);
    onStartUpdate();
    try {
      await deleteJob();
    } catch (err) {
      console.log(err);
      setError(err as Error);
    } finally {
      setIsSubmitting(false);
      onFinishUpdate(error);
    }
  }, [deleteJob, error, onFinishUpdate, onStartUpdate]);

  const saveDisabled = useMemo(
    () =>
      isEditing &&
      ((!isJobDirty && !areJobRolesDirty && !areJobSkillsDirty) ||
        !isJobValid ||
        !areJobRolesValid ||
        isSubmitting),
    [
      areJobRolesDirty,
      areJobRolesValid,
      areJobSkillsDirty,
      isEditing,
      isJobDirty,
      isJobValid,
      isSubmitting
    ]
  );

  return (
    <div className="relative">
      {error && <JobvanaError error={error} />}
      <EditDeleteButtons
        type="job"
        isEditing={isEditing}
        disabled={saveDisabled}
        onEdit={() => {
          setError(undefined);
          setEditJob(job);
          setEditJobRoles(job.job_roles);
          setEditJobSkills(job.job_skills);
          setIsEditing(true);
        }}
        onCancel={() => {
          if (isNew) {
            onCancelNewJob();
          } else {
            setEditJob(job);
            setEditJobRoles(job.job_roles);
            setEditJobSkills(job.job_skills);
            setIsEditing(false);
          }
        }}
        onDelete={!isNew ? onDelete : undefined}
        onSave={onSave}
      />
      <MyJobMain
        job={editJob}
        isDraft={job.status === 'draft'}
        setJob={setEditJob}
        updateInterviewProcess={updateInterviewProcess}
        setUpdateInterviewProcess={setUpdateInterviewProcess}
        addresses={addresses}
        isEditing={isEditing}
      />
      <div className="col-span-2">
        <Hr />
      </div>
      <MyJobRoles
        jobId={editJob.id}
        jobRoles={editJobRoles}
        setJobRoles={setEditJobRoles}
        isEditing={isEditing}
        duplicateRole={duplicateRole}
      />
      <div className="col-span-2">
        <Hr />
      </div>
      <MyJobSkills
        job={job}
        jobSkills={editJobSkills}
        setJobSkills={setEditJobSkills}
        isEditing={isEditing}
      />
    </div>
  );
};

export default MyJob;
