import _ from 'lodash';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { FaArchive, FaDraftingCompass, FaUndo } from 'react-icons/fa';
import {
  FaCaretDown,
  FaCaretRight,
  FaPencil,
  FaRocket,
  FaWrench
} from 'react-icons/fa6';
import { MdArchive, MdCheckCircleOutline, MdUnarchive } from 'react-icons/md';
import useApplicationsForJob from '../../applications/company/useApplicationsForJob';
import InterviewProcessDisplay from '../../companies/InterviewProcessDisplay';
import ActionMenuContainer from '../../containers/ActionMenuContainer';
import EditDeleteIcons from '../../controls/EditDeleteIcons';
import supabase from '../../db/supabase';
import Hr from '../../Hr';
import JobvanaError from '../../JobvanaError';
import type { CompanyAddress, JobRole, JobSkill, JobStatus } from '../../types';
import MyJobMain from './MyJobMain';
import MyJobRoles from './MyJobRoles';
import MyJobSkills from './MyJobSkills';
import type { Job } from './useJob';
import { areValidJobRoles, duplicateJobRoles, isValidJob } from './utils';

export type MyJobProps = {
  job: Job;
  isNew: boolean;
  addresses: Array<CompanyAddress>;
  showActionMenu?: boolean;
  onStartUpdate: () => void;
  onFinishUpdate: (error?: Error) => void;
  onCancelNewJob: () => void;
};

const MyJob = ({
  job,
  isNew,
  addresses,
  showActionMenu = true,
  onStartUpdate,
  onFinishUpdate,
  onCancelNewJob
}: MyJobProps) => {
  const { activeApplications } = useApplicationsForJob({
    jobId: job.id
  });
  const [editJob, setEditJob] = useState<Job>(job);
  const [showInterviewProcess, setShowInterviewProcess] = useState(false);
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

  const areJobSkillsValid = useMemo(
    () => editJobSkills.length > 0,
    [editJobSkills.length]
  );

  const isFrozen = useMemo(
    () => activeApplications === undefined || activeApplications > 0,
    [activeApplications]
  );

  useEffect(() => setIsEditing(isNew), [isNew]);

  useEffect(() => {
    setEditJob(job);
    setEditJobRoles(job.job_roles);
    setEditJobSkills(job.job_skills);
  }, [job]);

  const updateJob = useCallback(
    async (status?: JobStatus) => {
      const toUpdate = _.omit(editJob, 'job_roles', 'job_skills');
      if (toUpdate.company_address_id === -1) {
        toUpdate.company_address_id = null;
      }
      // if (updateInterviewProcess) {
      //   toUpdate.interview_process = company.interview_process;
      // }
      if (status) {
        toUpdate.status = status;
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
    },
    [editJob, job.id]
  );

  const createJob = useCallback(async () => {
    const toInsert = _.omit(
      editJob,
      'id',
      'created_at',
      'job_roles',
      'job_skills'
    );
    if (toInsert.company_address_id === -1) {
      toInsert.company_address_id = null;
    }
    const { data, error } = await supabase
      .from('jobs')
      .insert(toInsert)
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

  const onSave = useCallback(
    async (status?: JobStatus) => {
      setIsEditing(false);
      setIsSubmitting(true);
      setError(undefined);
      onStartUpdate();
      try {
        let newJobId: number | undefined;
        if ((isJobDirty && isJobValid) || status) {
          if (isNew) {
            newJobId = await createJob();
          } else {
            await updateJob(status);
          }
        }
        if ((isNew || areJobRolesDirty) && areJobRolesValid) {
          await updateJobRoles(newJobId);
        }
        if ((isNew || areJobSkillsDirty) && areJobSkillsValid) {
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
    },
    [
      areJobRolesDirty,
      areJobRolesValid,
      areJobSkillsDirty,
      areJobSkillsValid,
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
    ]
  );

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
        !areJobSkillsValid ||
        isSubmitting),
    [
      areJobRolesDirty,
      areJobRolesValid,
      areJobSkillsDirty,
      areJobSkillsValid,
      isEditing,
      isJobDirty,
      isJobValid,
      isSubmitting
    ]
  );

  const statusString = useMemo(() => {
    switch (job.status) {
      case 'closed':
        return 'Archived';
      case 'open':
        return 'Published';
      case 'draft':
        return isNew ? 'Adding new job' : 'Draft';
      case 'filled':
        return 'Filled';
    }
  }, [isNew, job.status]);

  return (
    <div>
      {showActionMenu && (
        <ActionMenuContainer>
          <div className="flex flex-row gap-1 items-center text-sm">
            <FaWrench />
            Job ID: {job.id}
            <div className="h-fit py-2 mx-1 border-r-[1.5px]" /> Status:
            {job.status === 'draft' &&
              (isNew ? <FaPencil /> : <FaDraftingCompass />)}
            {job.status === 'open' && <MdCheckCircleOutline />}
            {job.status === 'closed' && <FaArchive />}
            {statusString}
          </div>
          {job.status === 'draft' ? (
            <>
              {!isEditing && (
                <div className="content-center pr-12">
                  <div
                    className="cursor-pointer"
                    onClick={() => {
                      if (
                        confirm('Are you sure you want to publish this job?')
                      ) {
                        onSave('open');
                      }
                    }}
                  >
                    <FaRocket />
                  </div>
                </div>
              )}
              <EditDeleteIcons
                type="job"
                isEditing={isEditing}
                disabled={saveDisabled}
                bgColor="--color-blue-300"
                top="top-1.25"
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
                onSave={() => onSave()}
              />
            </>
          ) : undefined}
          {job.status === 'open' ? (
            <>
              {isFrozen && activeApplications ? (
                <div className="text-sm content-center">
                  {activeApplications} active application
                  {activeApplications > 1 ? 's' : ''}
                </div>
              ) : null}
              {!isFrozen && (
                <div className="flex flex-row gap-1 items-center">
                  <div
                    className="cursor-pointer hover:text-blue-400"
                    onClick={() => {
                      if (
                        confirm(
                          'Are you sure you want to move this job back to draft?'
                        )
                      ) {
                        onSave('draft');
                      }
                    }}
                  >
                    <FaUndo className="text-sm" />
                  </div>
                  <div
                    className="text-xl cursor-pointer hover:text-blue-400"
                    onClick={() => {
                      if (
                        confirm('Are you sure you want to archive this job?')
                      ) {
                        onSave('closed');
                      }
                    }}
                  >
                    <MdArchive />
                  </div>
                </div>
              )}
            </>
          ) : undefined}
          {job.status === 'closed' ? (
            <div className="content-center">
              <div
                className="text-xl cursor-pointer"
                onClick={() => {
                  if (confirm('Are you sure you want to reopen this job?')) {
                    onSave('open');
                  }
                }}
              >
                <MdUnarchive />
              </div>
            </div>
          ) : undefined}
        </ActionMenuContainer>
      )}
      <div className="px-4 mt-2 relative">
        {error && <JobvanaError error={error} />}
        {/* <EditDeleteButtons
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
        /> */}
        <MyJobMain
          job={editJob}
          // isNew={isNew}
          // isDraft={job.status === 'draft'}
          setJob={setEditJob}
          // updateInterviewProcess={updateInterviewProcess}
          // setUpdateInterviewProcess={setUpdateInterviewProcess}
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
        {!isEditing && job.interview_process && (
          <div className="mb-4">
            <div className="col-span-2">
              <Hr />
            </div>
            <div className="flex flex-row gap-1 mb-2">
              Interview Process
              <div
                className="content-center cursor-pointer"
                onClick={() => setShowInterviewProcess(!showInterviewProcess)}
              >
                {!showInterviewProcess && <FaCaretRight />}
                {showInterviewProcess && <FaCaretDown />}
              </div>
            </div>
            {showInterviewProcess && (
              <div className="border-[0.5px] border-blue-300 rounded-lg mt-2 px-4 py-4">
                <InterviewProcessDisplay
                  interviewProcess={job.interview_process}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyJob;
