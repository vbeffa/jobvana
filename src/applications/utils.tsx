import { FaArchive, FaDraftingCompass } from 'react-icons/fa';
import {
  FaBuilding,
  FaCheck,
  FaCheckDouble,
  FaNewspaper,
  FaPaperPlane,
  FaRegCircleCheck,
  FaRegCircleXmark,
  FaSpinner,
  FaUser
} from 'react-icons/fa6';
import { MdOutlinePending } from 'react-icons/md';
import { PiHandWithdraw } from 'react-icons/pi';
import supabase from '../db/supabase';
import { addJobSeekerApplicationNotification } from '../notifications/companies/utils';
import { addCompanyApplicationNotification } from '../notifications/job_seekers/utils';
import type {
  ApplicationStatus,
  Company as DbCompany,
  InterviewRoundStatus,
  InterviewStatus,
  JobStatus
} from '../types';

export type Company = Pick<DbCompany, 'name'>;

const applicationEventUser = (
  event: ApplicationStatus,
  jobSeekerName: string,
  company: Company
) => {
  switch (event) {
    case 'submitted':
    case 'withdrawn':
      return (
        <div className="flex flex-row items-center gap-1">
          <FaUser />
          {jobSeekerName}
        </div>
      );
    case 'accepted':
    case 'declined':
      return (
        <div className="flex flex-row items-center gap-1">
          <FaBuilding />
          {company.name}
        </div>
      );
  }
};

const getIcon = (
  status:
    | JobStatus
    | ApplicationStatus
    | InterviewStatus
    | InterviewRoundStatus
    | 'created'
) => {
  switch (status) {
    case 'draft':
      return <FaDraftingCompass />;
    case 'open':
      return <FaRegCircleCheck />;
    case 'closed':
      return <FaArchive />;
    case 'created':
      return <FaNewspaper />;
    case 'submitted':
      return <FaPaperPlane />;
    case 'accepted':
      return <FaCheck />;
    case 'completed':
    case 'filled':
      return <FaCheckDouble />;
    case 'withdrawn':
      return <PiHandWithdraw className="text-lg" />;
    case 'declined':
      return <FaRegCircleXmark />;
    case 'pending':
      return <MdOutlinePending />;
    case 'in_process':
      return <FaSpinner />;
  }
};

const updateStatus = async (
  applicationId: number,
  status: 'withdrawn' | 'accepted' | 'declined',
  userId: string
) => {
  // TODO add a transaction for this
  const { error: appErr } = await supabase
    .from('applications')
    .update({
      status,
      updated_at: new Date().toISOString()
    })
    .eq('id', applicationId);

  if (appErr) {
    console.log(appErr);
    throw appErr;
  }

  const { error: appEventsErr } = await supabase
    .from('application_events')
    .insert({
      application_id: applicationId,
      user_id: userId,
      event: status
    });
  if (appEventsErr) {
    console.log(appEventsErr);
    throw appEventsErr;
  }

  if (status === 'accepted') {
    const { data: interviewsData, error: interviewsErr } = await supabase
      .from('interviews')
      .insert({
        application_id: applicationId
      })
      .select();
    if (interviewsErr) {
      console.log(interviewsErr);
      throw interviewsErr;
    }

    const { error: interviewRoundsErr } = await supabase
      .from('interview_rounds')
      .insert({
        interview_id: interviewsData[0].id,
        round: 1
      });
    if (interviewRoundsErr) {
      console.log(interviewRoundsErr);
      throw interviewRoundsErr;
    }

    await addJobSeekerApplicationNotification(applicationId, 'accepted');
  } else if (status === 'declined') {
    await addJobSeekerApplicationNotification(applicationId, 'declined');
  } else {
    await addCompanyApplicationNotification(applicationId, 'withdrawn');
  }
};

const withdrawApplication = async (applicationId: number, userId: string) => {
  updateStatus(applicationId, 'withdrawn', userId);
};

const acceptApplication = async (applicationId: number, userId: string) => {
  updateStatus(applicationId, 'accepted', userId);
};

const declineApplication = async (applicationId: number, userId: string) => {
  updateStatus(applicationId, 'declined', userId);
};

export {
  acceptApplication,
  applicationEventUser,
  declineApplication,
  getIcon,
  updateStatus,
  withdrawApplication
};
