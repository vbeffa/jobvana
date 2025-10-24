import supabase from '../../db/supabase';
import type { JobSeeker } from '../../types';

const apply = async (
  jobId: number,
  companyId: string,
  jobSeeker: Pick<JobSeeker, 'id' | 'user_id'>,
  resumeName: string
) => {
  const fromFile = `${jobSeeker.user_id}/${resumeName}`;
  const toFile = `${jobId}/${jobSeeker.user_id}.pdf`;

  // TODO add a transaction for this
  const { data: appData, error: appErr } = await supabase
    .from('applications')
    .insert({
      job_id: jobId,
      job_seeker_id: jobSeeker.id,
      status: 'submitted'
    })
    .select();
  if (appErr) {
    console.log(appErr);
    throw appErr;
  }
  // console.log(appData);
  const id = appData[0].id;

  const { error: appEventsErr } = await supabase
    .from('application_events')
    .insert({
      application_id: id,
      user_id: jobSeeker.user_id,
      event: 'submitted'
    });
  if (appEventsErr) {
    console.log(appEventsErr);
    throw appEventsErr;
  }

  const { error: appNotificationsErr } = await supabase
    .from('application_notifications')
    .insert({
      application_id: id,
      target_user_id: companyId,
      type: 'submitted'
    });
  if (appNotificationsErr) {
    console.log(appEventsErr);
    throw appEventsErr;
  }

  const { data: storageData, error: storageErr } = await supabase.storage
    .from('resumes')
    .copy(fromFile, toFile, {
      destinationBucket: 'applications'
    });
  if (storageErr) {
    console.log(storageErr);
    throw storageErr;
  }
  console.log(storageData);

  const { error: appResumesErr } = await supabase
    .from('application_resumes')
    .insert({ application_id: id, resume_path: toFile });
  if (appResumesErr) {
    console.log(appResumesErr);
    throw appResumesErr;
  }
};

const hide = async (
  jobId: number,
  jobSeekerId: number,
  permanent?: boolean
) => {
  const { error } = await supabase.from('hidden_jobs').insert({
    job_id: jobId,
    job_seeker_id: jobSeekerId,
    deleted: permanent
  });
  if (error) {
    console.log(error);
    throw error;
  }
};

const unhide = async (jobId: number, jobSeekerId: number) => {
  const { error } = await supabase.from('hidden_jobs').delete().match({
    job_id: jobId,
    job_seeker_id: jobSeekerId
  });
  if (error) {
    console.log(error);
    throw error;
  }
};

const permanentlyHide = async (jobId: number, jobSeekerId: number) => {
  const { error } = await supabase
    .from('hidden_jobs')
    .update({ is_permanent: true })
    .match({
      job_id: jobId,
      job_seeker_id: jobSeekerId
    });
  if (error) {
    console.log(error);
    throw error;
  }
};

const save = async (jobId: number, jobSeekerId: number) => {
  const { error } = await supabase.from('saved_jobs').insert({
    job_id: jobId,
    job_seeker_id: jobSeekerId
  });
  if (error) {
    console.log(error);
    throw error;
  }
};

const unsave = async (jobId: number, jobSeekerId: number) => {
  const { error } = await supabase.from('saved_jobs').delete().match({
    job_id: jobId,
    job_seeker_id: jobSeekerId
  });
  if (error) {
    console.log(error);
    throw error;
  }
};

export { apply, hide, permanentlyHide, save, unhide, unsave };
